import { useMemo } from "react";
import { ResourceCard } from ".";
import { formatDateToTime } from "../utils";
import { getResourcesUrl } from "../config/api";

const isSubDictPresent = (mainDict, subDict) => {
    for (const [key, value] of Object.entries(subDict)) {
        if (mainDict[key] !== value) return false;
    }
    return true;
};

const ResourceSearch = ({ query }) => {
    const { fileList, itemsList } = useMemo(() => {
        try {
            const raw = localStorage.getItem("filesDetails");
            if (!raw) return { fileList: [], itemsList: [] };
            const tempData = JSON.parse(raw);
            if (!tempData || typeof tempData !== "object") return { fileList: [], itemsList: [] };
            const tempData2 = Object.values(tempData).flat();
            if (!tempData2.length) return { fileList: [], itemsList: [] };

            const newData = {};
            if (query && query.trim()) {
                const lower = query.toLowerCase();
                tempData2.forEach((obj) => {
                    const file = Object.keys(obj)[0];
                    const item = obj[file];
                    if (!item?.title || !item.title.toLowerCase().includes(lower)) return;
                    Object.keys(tempData).forEach((key) => {
                        for (let j = 0; j < tempData[key].length; j++) {
                            if (isSubDictPresent(tempData[key][j], { [file]: item })) {
                                if (!newData[key]) newData[key] = [];
                                newData[key].push({ [file]: item });
                            }
                        }
                    });
                });
            } else {
                Object.keys(tempData).forEach((key) => {
                    newData[key] = tempData[key] || [];
                });
            }
            const tempData3 = Object.values(newData).flat();
            const list = tempData3.map(obj => Object.keys(obj)[0]);
            return { fileList: list, itemsList: tempData3 };
        } catch {
            return { fileList: [], itemsList: [] };
        }
    }, [query]);

    const base = getResourcesUrl().replace(/\/$/, "");

    return (
        <div className="w-full">
            <div className="pt-4 pl-6 text-gray-400">
                <span className="text-lg font-serif">Resources</span>
            </div>
            <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                {fileList.map((file, index) => {
                    const obj = itemsList[index];
                    const item = obj?.[file];
                    if (!item) return null;
                    const fileUrl = `${base}/${file}+${encodeURIComponent(item.title ?? "")}`;
                    return (
                        <ResourceCard
                            key={`${file}-${index}`}
                            fileUrl={fileUrl}
                            description={item.description}
                            uploaderUsername={item.uploaderUsername}
                            title={item.title}
                            date={item.date ? formatDateToTime(new Date(item.date)) : ""}
                            semester={item.semester}
                            course={item.course}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ResourceSearch;