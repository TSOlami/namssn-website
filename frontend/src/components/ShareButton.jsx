import { toast } from "react-toastify";

const ShareButton = ({fileUrl, title}) => {
    const handleShare = async () => {
        try {
            toast.promise(navigator.share({
                title: title,
                text: 'Check out this link!',
                url: fileUrl
            }), {
                pending: "Sharing...",
                success: "Shared successfully",
            })
        } catch (error) {
            toast.error("Error sharing file");
            console.error('Error sharing:', error);
        }
    };

    return (
        <div className="flex items-center justify-center mt-6">
            <button
                onClick={handleShare}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Share Link
            </button>
        </div>
    );
};

export default ShareButton;