import GetTeams from '../components/GetTeams';
import AddDataForm from '../components/AddDataForm';
import AddTeamContent from '../components/AddTeamContent';

const Teams = () => {
  return (
    <>
      <div style={{ marginRight: 10, marginLeft: 10 }}>
        <GetTeams />
        <AddDataForm addContent={AddTeamContent} formWidth={300} />
      </div>
    </>
  );
};

export default Teams;
