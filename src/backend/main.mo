import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


actor {
  // System state (cannot be modified)
  let accessControlState = AccessControl.initState();

  // Prefab components
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User profile type
  public type UserProfile = {
    name : Text;
  };
  let userProfiles = Map.empty<Principal, UserProfile>();

  type OlderSubmission = {
    originalText : Text;
    variations : [Text];
    timestamp : Time.Time;
  };

  type Submission = {
    photoA : ?Text;
    photoB : ?Text;
    variations : [Text];
    timestamp : Time.Time;
  };

  let userHistories = Map.empty<Principal, [Submission]>();

  // Image fusion types
  public type FusionRequest = {
    photoA : Storage.ExternalBlob;
    photoB : Storage.ExternalBlob;
    description : Text;
  };

  public type FusionResult = {
    originalPhotoA : Storage.ExternalBlob;
    originalPhotoB : Storage.ExternalBlob;
    optPhotoA : ?Text;
    optPhotoB : ?Text;
    variations : [Text];
    timestamp : Time.Time;
  };

  let fusionLibrary = Map.empty<Principal, [FusionResult]>();

  // Profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Add a new submission to user's history (persistent model)
  public shared ({ caller }) func addSubmission(photoA : Text, photoB : Text, variations : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add submissions");
    };

    let newSubmission : Submission = {
      photoA = ?photoA;
      photoB = ?photoB;
      variations;
      timestamp = Time.now();
    };

    let updatedHistory = switch (userHistories.get(caller)) {
      case (null) { [newSubmission] };
      case (?history) { history.concat([newSubmission]) };
    };

    userHistories.add(caller, updatedHistory);
  };

  // Add old-style submission for backward compatibility
  public shared ({ caller }) func addOlderSubmission(originalText : Text, variations : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add submissions");
    };

    let newSubmission : Submission = {
      photoA = ?originalText;
      photoB = null;
      variations;
      timestamp = Time.now();
    };

    let updatedHistory = switch (userHistories.get(caller)) {
      case (null) { [newSubmission] };
      case (?history) { history.concat([newSubmission]) };
    };

    userHistories.add(caller, updatedHistory);
  };

  // Get the full history for the caller
  public query ({ caller }) func getHistory() : async [Submission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access history");
    };

    switch (userHistories.get(caller)) {
      case (null) { [] };
      case (?history) { history };
    };
  };

  // Get a specific submission by timestamp
  public query ({ caller }) func getSubmissionByTimestamp(timestamp : Int) : async Submission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access submissions");
    };

    switch (userHistories.get(caller)) {
      case (null) { Runtime.trap("No history for caller") };
      case (?history) {
        switch (history.find(func(sub) { sub.timestamp == timestamp })) {
          case (null) { Runtime.trap("Submission not found") };
          case (?submission) { submission };
        };
      };
    };
  };

  // Clear user's history
  public shared ({ caller }) func clearHistory() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear history");
    };

    userHistories.remove(caller);
  };

  // Get all user Principals with history (for admin/statistic purposes)
  public query ({ caller }) func getAllUsersWithHistory() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    userHistories.keys().toArray();
  };
};
