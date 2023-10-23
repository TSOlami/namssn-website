
const ShareButton = ({fileUrl, title}) => {
    const handleShare = async () => {
        try {
            await navigator.share({
                title: title,
                text: 'Check out this link!',
                url: fileUrl
            });
            console.log('Link shared successfully');
        } catch (error) {
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