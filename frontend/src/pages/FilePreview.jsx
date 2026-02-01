import { useParams, useLocation, useSearchParams } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FilePreview = () => {
    const { title } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const fileUrlFromQuery = searchParams.get("fileUrl");
    const fileUrl = fileUrlFromQuery ? decodeURIComponent(fileUrlFromQuery) : location.state;

    if (!fileUrl || typeof fileUrl !== "string") {
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-gray-600">
                <p>Preview unavailable: file link is missing. Open the resource from the same tab or use the download button.</p>
            </div>
        );
    }

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
    ];
    const safeTitle = title && typeof title === "string" ? title : "resource";
    const ext = (safeTitle.split(".").pop() || "").toLowerCase();
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
        case 'jpeg':
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
                <div className="w-full h-screen text-lg font-roboto text-red-600 flex justify-center items-center">
                    <span>Unsupported File Type</span>
                </div>
            );
    }
}

export default FilePreview;