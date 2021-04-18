import org.json.simple.JSONObject;

public class post {
    public long time = System.currentTimeMillis();
    public String description = "";
    boolean isVideo;
    public String file= null;

    public post() {}
    public post(JSONObject jo) {
        if(jo.containsKey("time")) time = (long) jo.get("time");
        if(jo.containsKey("description")) description = (String) jo.get("description");
        if(jo.containsKey("isVideo")) isVideo = (boolean) jo.get("isVideo");
        if(jo.containsKey("file")) file = (String) jo.get("file");
    }

    @SuppressWarnings("unchecked")
    @Override
    public String toString() {
        JSONObject jo = new JSONObject();
        jo.put("time", time);
        jo.put("description", description);
        jo.put("isVideo", isVideo);
        jo.put("file", file);
        return jo.toJSONString();
    }
}
