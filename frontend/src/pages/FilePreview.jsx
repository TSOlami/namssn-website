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
        },
        {
            uri: fileUrl,
            fileType: "docx",
            fileName: title 
        },
        {
            uri: fileUrl,
            fileType: "jpg",
            fileName: title 
        },
        {
            uri: fileUrl,
            fileType: "png",
            fileName: title 
        },
        {
            uri: fileUrl,
            fileType: "xsl",
            fileName: title 
        },
        {
            uri: fileUrl,
            fileType: "ppt",
            fileName: title 
        }
    ]
    const ext = title.split('.')[title.split('.').length - 1].toLowerCase()
    console.log(ext)
    switch (ext) {
        case 'pdf':
            return (
                <div>
                    <DocViewer documents={[docs[0]]} pluginRenderers={DocViewerRenderers}
                    />
                </div>
            );
        case 'jpg':
            return (
                <div>
                    <DocViewer documents={[docs[2]]} pluginRenderers={DocViewerRenderers}
                    />
                </div>
            );
        case 'png':
            return (
                <div>
                    <DocViewer documents={[docs[3]]} pluginRenderers={DocViewerRenderers}
                    />
                </div>
            );
        case 'docx':
            return (
                <div>
                    <DocViewer documents={[docs[1]]} pluginRenderers={DocViewerRenderers}
                    />
                </div>
            );
        case 'ppt':
            return (
                <div>
                    <DocViewer documents={[docs[5]]} pluginRenderers={DocViewerRenderers}
                    />
                </div>
            )
        case 'xsl':
            return (
                <div>
                    <DocViewer documents={[docs[4]]} pluginRenderers={DocViewerRenderers}
                    />
                </div>
            );
        default:
            return (
                <div>
                    Cannot Open this type of file
                </div>
            );
    }
}

export default FilePreview;