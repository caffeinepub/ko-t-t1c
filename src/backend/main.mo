import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";

actor {
  type Submission = {
    originalText : Text;
    variations : [Text];
    timestamp : Time.Time;
  };

  let userHistories = Map.empty<Principal, [Submission]>();

  // Add a new submission to user's history
  public shared ({ caller }) func addSubmission(originalText : Text, variations : [Text]) : async () {
    let newSubmission : Submission = {
      originalText;
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
    switch (userHistories.get(caller)) {
      case (null) { [] };
      case (?history) { history };
    };
  };

  // Get a specific submission by timestamp
  public query ({ caller }) func getSubmissionByTimestamp(timestamp : Int) : async Submission {
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
    userHistories.remove(caller);
  };

  // Get all user Principals with history
  public query ({ caller }) func getAllUsersWithHistory() : async [Principal] {
    userHistories.keys().toArray();
  };
};
