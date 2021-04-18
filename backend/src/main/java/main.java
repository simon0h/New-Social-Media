import org.json.simple.JSONObject;

import java.util.HashSet;


public class main {
    public static void main(String[] args) {
        HashSet<String> fri = new HashSet<String>();
        fri.add("A");
        fri.add("B");
        profile libo = new profile("libo", "coding", "libo.png", fri);
        profile jumao = new profile("jumao", "abaaba");
        profile rellie = new profile("rellie");
        profile a = new profile("a", "ganshenma", "a.jpg");
        database db = new database();
        db.addProfile(libo);
        db.addProfile(jumao);
        db.addProfile(rellie);
        db.addProfile(a);
        db.writeDataBase("db.txt");
        database db2 = new database();
        db2.readDataBase("db.txt");
        db2.addProfilePost("libo", "1");
        db2.addProfilePost("libo", "2");
        System.out.println(db2);


        db2.addProfileFriend("jumao", "libo");
        db2.addProfile("libo2");
        db2.writeDataBase("db.txt");
        db2.readDataBase("db.txt");
        db2.addProfileCurrentViews("libo", new post());
        System.out.println(db2.getProfileCurrentViews("libo"));
    }
}
