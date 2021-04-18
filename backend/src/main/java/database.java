import java.util.ArrayList;
import java.util.HashMap;
import java.io.*;
import java.util.HashSet;
import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class database {
    private HashMap<String, profile> database = new HashMap<String, profile>();

    public database() {}

    public database(String fileName) {
        readDataBase(fileName);
    }

    public void readDataBase(String fileName) {
        try {
            database = new HashMap<String, profile>();
            FileReader fr = new FileReader(fileName);   //reads the file
            JSONParser parser = new JSONParser();
            Object object = parser.parse(fr);
            JSONObject jsonObject = (JSONObject) object;
            for(Object o : jsonObject.values()) {
                profile p = new profile((JSONObject) o);
                database.put(p.getProfileName(), p);
            }
            fr.close();
        } catch (IOException | ParseException e) {
            System.out.println(e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public void writeDataBase(String fileName) {
        try {
            FileWriter fw = new FileWriter(fileName);
            JSONObject jo = new JSONObject(database);
            fw.write(jo.toJSONString());
            fw.close();
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    public void addProfile(profile p) {
        database.put(p.getProfileName(), p);
    }

    public void addProfile(String name) {
        database.put(name, new profile(name));
    }

    public void addProfile(String name, String status) {
        database.put(name, new profile(name, status));
    }

    public void addProfile(String name, String status, String image) {
        database.put(name, new profile(name, status, image));
    }

    public void addProfile(String name, String status, String image, HashSet<String> friends) {
        database.put(name, new profile(name, status, image, friends));
    }

    public void removeProfile(String name) {
        database.remove(name);
    }

    public HashMap<String, profile> getDatabase() {
        return database;
    }

    public void setDatabase(HashMap<String, profile> database) {
        this.database = database;
    }

    public boolean containsProfile(String name) {
        return database.containsKey(name);
    }

    public profile getProfile(String name) {
        return database.get(name);
    }

    public String getProfileString(String name) {
        profile p = database.get(name);
        return (p != null) ? p.toString() : "";
    }

    public String getProfileStatus(String name) {
        profile p = database.get(name);
        return (p != null) ? p.getProfileStatus() : "";
    }

    public String getProfileImage(String name) {
        profile p = database.get(name);
        return (p != null) ? p.getProfileImage() : "";
    }

    public HashSet<String> getProfileFriends(String name) {
        profile p = database.get(name);
        return (p != null) ? p.getProfileFriends() : null;
    }

    public void setProfileStatus(String name, String status) {
        profile p = database.get(name);
        if (p != null) p.setProfileStatus(status);
    }

    public void setProfileImage(String name, String image) {
        profile p = database.get(name);
        if (p != null) p.setProfileImage(image);
    }

    public void addProfileFriend(String name, String friend) {
        profile p = database.get(name);
        if (p != null) p.addFriend(friend);
    }

    public void removeProfileFriend(String name, String friend) {
        profile p = database.get(name);
        if (p != null) p.removeFriend(friend);
    }

    public void addProfilePost(String name, String description) {
        profile p = database.get(name);
        if (p != null) p.addPost(System.currentTimeMillis(), description);
    }

    public void addProfilePost(String name, post po) {
        profile p = database.get(name);
        if (p != null) p.addPost(po);
    }

    public void addProfileCurrentViews(String name, post po) {
        profile p = database.get(name);
        if (p != null) p.addCurrentViews(po);
    }

    public ArrayList<post> getProfileCurrentViews(String name) {
        profile p = database.get(name);
        return (p != null) ? p.getCurrentViews() : null;
    }

    public ArrayList<post> getProfilePosts(String name) {
        profile p = database.get(name);
        return (p != null) ? p.getPosts() : null;
    }

    @Override
    public String toString() {
        return database.toString();
    }

}
