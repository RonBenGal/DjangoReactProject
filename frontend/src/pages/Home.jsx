import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../components/Note"
import Counter from "../components/Counter"; 
import "../styles/Home.css"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [counter , setCounter] = useState("");
  
  const navigate = useNavigate();  // Get the navigate function from react-router-dom

  // Function to handle logout and clear tokens
  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);  // Remove access token
    localStorage.removeItem(REFRESH_TOKEN);  // Remove refresh token
    navigate('/login');  // Redirect to login page
  };

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => alert(error));
    
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note created!");
        else alert("Failed to make note");
        getNotes();
      })
      .catch((err) => alert(err));  
    
  };

  return (
    <div>
        <div>
            <h2>Notes</h2>
            {notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id} />)}
            
        </div>
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
            <label htmlFor="title">Title:</label>
            <br />
            <input
                type="text"
                id="title"
                name="title"
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <label htmlFor="content">Content:</label>
            <br />
            <textarea
                id="content"
                name="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <br />
            <input type="submit" value="Submit"></input>
        </form>
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
        <div><Counter /></div>
    </div>
);
}

export default Home;
