import { Grid } from "react-loader-spinner";

function Loading() {
  return (
    <div className="fixed inset-0 bg-main-color flex justify-center items-center z-50">
      <Grid
        visible={true}
        height="80"
        width="80"
        color="#FFF"
        ariaLabel="grid-loading"
        radius="12.5"
        wrapperStyle={{}}
        wrapperClass="grid-wrapper"
      />
    </div>
  );
}

export default Loading;
