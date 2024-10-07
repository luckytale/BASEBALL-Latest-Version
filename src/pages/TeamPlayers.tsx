import GetPlayers from '../components/GetPlayers';
import AddDataForm from '../components/AddDataForm';
import AddPlayerContent from '../components/AddPlayerContent';

const TeamPlayers = () => {
  return (
    <>
      <div style={{ marginRight: 5, marginLeft: 5 }}>
        <GetPlayers />
        <AddDataForm addContent={AddPlayerContent} formWidth={450} />
      </div>
    </>
  );
};

export default TeamPlayers;
