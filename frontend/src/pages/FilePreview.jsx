import { useParams, useLocation } from "react-router-dom";
import DocViewer, {DocViewerRenderers} from "@cyntler/react-doc-viewer";


const FilePreview = () => {
    const { title } = useParams();
    const location = useLocation();
    const fileUrl  = location.state;

    const docs = [
        {
            uri: fileUrl,
            fileType: "pdf",
            fileName: title 
        }
    ]

    return (
        <div>
            <DocViewer documents={docs} pluginRenderers={DocViewerRenderers}
            />
        </div>
    )
}

export default FilePreview;