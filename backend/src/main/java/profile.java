import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.ArrayList;
import java.util.HashSet;

//import java.util.HashSet;

public class profile {
    private String profileName = "";
    private String profileStatus = "";
    private String profileImage = "";
    private HashSet<String> profileFriends = new HashSet<String>();
    private ArrayList<post> posts = new ArrayList<post>(); //sorted so that the newest is in the front
    private ArrayList<post> currentViews = new ArrayList<post>(); //sorted so that the newest is in the front

    public profile(String name) {
        this.profileName = name;
    }

    public profile(String name, String profileStatus) {
        this.profileName = name;
        this.profileStatus = profileStatus;
    }

    public profile(String name, String profileStatus, String profileImage) {
        this.profileName = name;
        this.profileStatus = profileStatus;
        this.profileImage = profileImage;
    }

    public profile(String name, String profileStatus, String profileImage, HashSet<String> profileFriends) {
        this.profileName = name;
        this.profileStatus = profileStatus;
        this.profileImage = profileImage;
        this.profileFriends = profileFriends;
    }

    public profile(JSONObject jo) {
        if(jo.containsKey("profileName")) profileName = (String) jo.get("profileName");
        if(jo.containsKey("profileStatus")) profileStatus = (String) jo.get("profileStatus");
        if(jo.containsKey("profileImage")) profileImage = (String) jo.get("profileImage");
        if(jo.containsKey("profileFriends")) {
            JSONArray ja = (JSONArray) jo.get("profileFriends");
            profileFriends = new HashSet<String>();
            for(Object o: ja) profileFriends.add((String) o);
        }
        if(jo.containsKey("posts")) {
            posts = new ArrayList<post>();
            JSONArray joPosts = (JSONArray) jo.get("posts");
            for (Object o : joPosts) {
                post p = new post((JSONObject) o);
                posts.add(p);
            }
            posts.sort((o1, o2) -> (int) (o2.time - o1.time));
        }

        if(jo.containsKey("currentViews")) {
            currentViews = new ArrayList<post>();
            JSONArray joPosts = (JSONArray) jo.get("currentViews");
            for (Object o : joPosts) {
                post p = new post((JSONObject) o);
                currentViews.add(p);
            }
            currentViews.sort((o1, o2) -> (int) (o2.time - o1.time));
        }
    }

    public String getProfileName() {
        return profileName;
    }

    public String getProfileStatus() {
        return profileStatus;
    }

    public void setProfileStatus(String profileStatus) {
        this.profileStatus = profileStatus;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public java.util.HashSet<String> getProfileFriends() {
        return profileFriends;
    }

    public boolean addFriend(String friend) {
        return profileFriends.add(friend);
    }

    public boolean removeFriend(String friend) {
        return profileFriends.remove(friend);
    }

    public boolean containFriend(String friend) {
        return profileFriends.contains(friend);
    }

    public void addPost(post p) {
        posts.add(p);
        posts.sort((o1, o2) -> (int) (o2.time - o1.time));
    }

    public void addPost(long time, String description) {
        post p = new post();
        p.time = time;
        p.description = description;
        posts.add(p);
        posts.sort((o1, o2) -> (int) (o2.time - o1.time));
    }

    public void addCurrentViews(post p) {
        currentViews.add(p);
        currentViews.sort((o1, o2) -> (int) (o2.time - o1.time));
    }

    public ArrayList<post> getCurrentViews() {
        return currentViews;
    }

    public ArrayList<post> getPosts() {
        return posts;
    }

    @SuppressWarnings("unchecked")
    @Override
    public String toString() {
        JSONObject jo = new JSONObject();
        jo.put("profileName", profileName);
        jo.put("profileStatus", profileStatus);
        jo.put("profileImage", profileImage);
        JSONArray ja = new JSONArray();
        for (String f : profileFriends) ja.add(f);
        jo.put("profileFriends", ja);
        jo.put("posts", posts);
        return jo.toString();
    }
}
