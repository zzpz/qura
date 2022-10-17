import Settings from "../components/Settings";
import ChangeAttributeForm from "../components/ChangeAttributeForm";
import Status from "../components/Status";
import { useEffect } from "react";

const SettingsRoute = () => {

  useEffect(() => {
    document.title = "QUR Association Inc"
  })

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Settings</h2>
      <Status></Status>

      <Settings />
      <ChangeAttributeForm />
    </main>
  );
}
export default SettingsRoute