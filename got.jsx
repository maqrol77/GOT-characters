const { useState, useEffect, useReducer } = React;

const initialState = {
  loading: true,
  error: "",
  characters: []
};

const reduce = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        loading: false,
        error: "",
        characters: action.payload
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        error: "Failed to fetch characters.",
        characters: []
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reduce, initialState);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://thronesapi.com/api/v2/Characters"
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR" });
      }
    };
    fetchData();
  }, []);

  const { loading, error, characters } = state;

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setShowButtons(false);
  };

  const handleHeadingClick = () => {
    setShowButtons(true);
    setSelectedCharacter(null);
  };

  return (
    <div className="container">
      <h1 onClick={handleHeadingClick}>Game Of Thrones Characters</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {showButtons && (
            <ul className="character-list">
              {characters.map((character) => (
                <li
                  key={character.id}
                  className="character-item"
                  onClick={() => handleCharacterClick(character)}
                >
                  {character.fullName}
                </li>
              ))}
            </ul>
          )}
          {selectedCharacter ? (
            <div className="card">
              <div className="imgBx">
                <img
                  src={selectedCharacter.imageUrl}
                  alt={selectedCharacter.name}
                  className="character-image"
                />
              </div>
              <div className="details">
                <h3>{selectedCharacter.name}</h3>
                <h3>{selectedCharacter.fullName}</h3>
                <h4>Title: {selectedCharacter.title}</h4>
                <h4>House: {selectedCharacter.family}</h4>
              </div>
              <p className="tag">Game of Thrones</p>
            </div>
          ) : (
            <p className="message">Select a character to view more details.</p>
          )}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
