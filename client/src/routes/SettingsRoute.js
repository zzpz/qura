import Settings from "../components/Settings";
import ChangeAttributeForm from "../components/ChangeAttributeForm";

export default function set(){
    return(
        <main style={{ padding: "1rem 0" }}>
        <h2>Settings</h2>
        <Settings />
        <ChangeAttributeForm/>
      </main>
    );
}