import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";

function NotFound() {
useDocumentTitle("Page Not Found");
    return (
        <>
            <div className="text-center text-red-500 my-20">
                <h1 className="text-4xl font-bold">Not Found</h1>
                <h2 className="text-3xl"> 4 0 4</h2>
            </div>
        </>        
    )
}

export default NotFound
