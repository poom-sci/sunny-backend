import helloWorld from "./helloWorld";
import messageProcessing from "./messageProcessing";
import messageSuccess from "./messageSuccess";
import messageFailed from "./messageFailed";

export default async function events() {
  helloWorld();
  messageProcessing();
  messageSuccess();
  messageFailed();
}
