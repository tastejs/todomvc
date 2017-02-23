package live.connector.vertxui.samples.client.todomvc;

public class Model {

	private String title;
	private boolean completed;
	private long id;

	public Model() {
	}

	public Model(String title, boolean completed) {
		this.title = title;
		this.completed = false;
		this.id = (long) (Math.random() * (double) Long.MAX_VALUE);
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

}
