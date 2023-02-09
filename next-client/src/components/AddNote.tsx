export default function AddNote() {
  return (
    <div className="m-4 border rounded-md">
      <div className="p-2">
        <form action="post">
          <div className="grid gap-4">
            <input
              type="text"
              name="title"
              id="title"
              className="border rounded-md p-2 focus:outline-cyan-400"
              placeholder="Title input"
            />
            <textarea
              name="description"
              id="description"
              cols={20}
              rows={5}
              placeholder="Description input"
              className="border rounded-md p-2 focus:outline-cyan-400"
            ></textarea>
          </div>
          <div className="p-2 text-right">
            <button className="border rounded-md px-4 py-2 bg-cyan-500 text-white">
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
