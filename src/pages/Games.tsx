import GetGames from '../components/GetGames';
import AddDataForm from '../components/AddDataForm';
import AddGameContent from '../components/AddGameContent';

const Games = () => {
  return (
    <>
      <div style={{ marginRight: 10, marginLeft: 10 }}>
        <GetGames />
        <AddDataForm addContent={AddGameContent} formWidth={500} />
      </div>
    </>
  );
};

export default Games;
