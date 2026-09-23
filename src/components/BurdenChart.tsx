import PrevalenceFrame from "./PrevalenceFrame";

/**
 * How many people have AMD.
 *
 * The market figure used to sit beside this one and now lives on the investors
 * page alone. The two were only ever paired for layout: this is the clinical
 * case, which every reader needs, while the size of the opportunity is an
 * argument addressed to one reader in particular, and the home page is not
 * where that conversation belongs.
 *
 * The wrapper is a size container: the chart lays itself out by the room it
 * is given, not by the screen. Full width on the home page it puts the frame
 * of people beside its caption and controls; in the investors page's column,
 * and on a phone, it stacks.
 */
export default function BurdenChart() {
  return (
    <div className="@container">
      <PrevalenceFrame />
    </div>
  );
}
