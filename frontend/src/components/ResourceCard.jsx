/* eslint-disable no-unused-vars */
import apiClient from "../utils/apiClient";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";
import { FaFileLines } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { MdPreview } from "react-icons/md";
import { Link } from "react-router-dom";
import { getResourcesUrl } from "../config/api";
import { ConfirmDialog } from "./ConfirmDialog";

const ResourceCard = ({
  uploaderUsername,
  uploaderId,
  title,
  course,
  fileUrl,
  description,
  semester,
  date,
  isLarge,
  fileUrl2,
}) => {
  const userInfo = useSelector((state) => state.auth?.userInfo);
  const isAdmin = userInfo?.role;

  let cardbg = 'bg-blue-300';
  if (isLarge === true) {
    cardbg = 'bg-yellow-300';
  }
  const cardClass =
  `cursor-pointer flex flex-col justify-center items-center rounded-[10px] ${cardbg} p-2 min-w-[140px] h-[150px] w-[150px]`;

  const handleShare = async () => {
        try {
            toast.promise(navigator.share({
              title: title,
              text: 'Check out this link!',
              url: fileUrl
          }), {
            pending: "Sharing...",
            success: "Shared successfully",
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

  const [openOptions, setOpenOptions] = useState(false);
  const handleSetOpenOptions = () => {
    setOpenOptions(!openOptions);
  };

  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);
  const handleSetShowDetails = (e) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const buttonRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openOptions]);

  const viewFile = (url) => {
    const targetUrl = url ?? fileUrl2 ?? fileUrl;
    if (!targetUrl) {
      toast.error("File link unavailable");
      return;
    }
    const w = window.open();
    w.location = targetUrl;
  };
  
  const downloadFile = async (fileUrl) => {
    try {
      const downloadWindow = window.open(fileUrl);
  
      if (!downloadWindow) {
        throw new Error('Popup blocked. Please allow popups and try again.');
      }
  
      toast.promise(
        Promise.resolve(fileUrl),
        { pending: 'Downloading file...', success: 'File downloaded successfully' }
      );
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error downloading file');
    }
  };

  const handleFileDelete = async (fileUrl) => {	
    handleSetOpenOptions();
    await toast.promise(apiClient
      .delete(fileUrl, { data: { _id: userInfo?._id, level: semester } })
      .then((res) => {
        if (res.data === "Access Approved") {
          toast.success("File Successfully Deleted!");
          window.location.reload();
        } else if (res.data === "Access Denied") {
          toast.error("You are not priviledged to delete this file");
        }
      })
      .catch(() => {
        toast.error("An error occurred. Unable to delete resource");
      }), {
      pending: 'Deleting file...',
  });
  };

  const handleNewDelete = (e) => {
    e.stopPropagation();
    const base = getResourcesUrl().replace(/\/$/, '');
    const url = isLarge === true
      ? `${base}/${(fileUrl2 || '').replace(new RegExp('/', 'g'), '%2F')}`
      : fileUrl;
    setUrlToDelete(url);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (urlToDelete) {
      handleFileDelete(urlToDelete);
      setUrlToDelete(null);
    }
  };

  const smStyle = "text-sm text-gray-400 font-serif";
  const lgStyle = "text-sm text-blue-600 font-serif font-medium";

  return (
    <div className="w-[10em] flex flex-col items-center my-2">

      <div
        className={cardClass + " relative"}
      >
        <FaFileLines/>
        <span className="pb-2 ">{title.length > 16 ? `${title.substring(0,15)}...` : title}</span>
        <span
          onClick={(event) => {
            event.stopPropagation();
            handleSetOpenOptions();
          }}
          className="absolute right-0 top-0 z-[200] p-3"
        >
          <HiDotsVertical />
        </span>

        <div ref={buttonRef}>
          {openOptions && (
            <div>
              <div
                onClick={handleSetShowDetails}
                className="bg-white p-2 absolute right-3 top-[50px] flex items-center shadow-lg w-[120px] hover:border border-black z-[201]"
              >
                Details
              </div>
              <div
                onClick={handleShare}
                className="bg-white p-2 absolute right-3 top-[92px] flex items-center shadow-lg w-[120px] hover:border border-black z-[201]"
              >
                Share
              </div>
              {(isAdmin === "admin" || uploaderId===userInfo?._id) ?
                (<button
                  onClick={handleNewDelete}
                  className="text-red-500 p-2 absolute bg-white right-3 top-2 flex items-center gap-2 shadow-lg z-[201] hover:border border-black"
                >
                  <MdDelete /> <span>Delete File</span>
                </button>) : (<div></div>)
              }
            </div>
          )}
        </div>
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => { setShowDeleteConfirm(false); setUrlToDelete(null); }}
          onConfirm={handleConfirmDelete}
          title="Delete file?"
          message="This file will be permanently deleted. This cannot be undone."
          confirmLabel="Delete File"
        />
        <div className="flex justify-around gap-10 pt-2 -4">
          {isLarge===false && (<FaCloudDownloadAlt onClick={() => downloadFile(fileUrl)} className="w-[25px] h-[25px] hover:animate-pulse hover:fill-blue-600"/>)}
          {isLarge===false ? (
            <Link
              to={fileUrl && typeof fileUrl === 'string' && title != null && title !== ''
                ? `/resources/preview/${encodeURIComponent(title)}?fileUrl=${encodeURIComponent(
                    fileUrl.startsWith('http') ? fileUrl : (typeof window !== 'undefined' ? window.location.origin + (fileUrl.startsWith('/') ? fileUrl : '/' + fileUrl) : fileUrl)
                  )}`
                : '#'}
              state={fileUrl}
            >
              <MdPreview className="drop-shadow-lg w-[25px] h-[25px] hover:animate-pulse hover:fill-blue-600"/>
            </Link>
          ) : (<MdPreview onClick={() => viewFile(fileUrl2)} className="drop-shadow-lg w-[25px] h-[25px] hover:animate-pulse hover:fill-blue-600"/>)}
        </div>
      </div>
      {(showDetails && openOptions) && (
          <div className="drop-shadow-lg flex flex-col px-2 border border-b-blue-400 border-l-blue-400 border-r-blue-400 bg-white">
            <span className={lgStyle}>{description}</span>
            <div>
              <span className={smStyle}>For </span>
              <span className={lgStyle}>{semester}</span>
            </div>
            <div>
              <span className={smStyle}>By </span>{" "}
                <span className={lgStyle}>{uploaderUsername?.length > 10 ? (
                  <span>{uploaderUsername.slice(0, 10)}... </span>
                ) : (
                  <span>{uploaderUsername}</span>
                )}</span>
            </div>
            <div>
              <span className={smStyle}>Uploaded </span>
              <span className={lgStyle}>{date}</span>
              <span className={smStyle}> ago</span>
            </div>
          </div>
        )}
       </div>
  );
};

export default ResourceCard;
