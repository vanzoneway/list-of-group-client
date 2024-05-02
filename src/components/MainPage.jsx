import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../CONSTS";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Loader } from "./Loader";
function MainPage() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [hover, setHover] = useState("");
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    async function Init() {
      try {
        setLoading(true)
        const res = await axios.post(`${SERVER_URL}/postEmployee`);
        const res2 = await axios.get(`${SERVER_URL}/getGroupsInDatabase`);
        console.log(res);
        console.log(res2);
        
        if (res2.status ===200) {
          setGroupList(res2.data)
          setLoading(false)
        }
      } catch (e) {
        console.log(e);
      }
    }
    Init();
  }, []);
  const removeGroupHandler = async (group) => {
    try {
      const res = await axios
        .delete(`${SERVER_URL}/removeGroupFromDatabase/${group}`)
        .catch((error) => {
          if (error.response.status !== 404) {
          toast.error(error.response.data.message);
          }
        });
        setGroupList((prev) => [...prev.filter((item) => item !== group)]);
        
    } catch (e) {
      console.log(e);
    }
  }
  const addGroupHandler = async () => {
    try {
      const res = await axios
        .post(`${SERVER_URL}/postSchedule/${inputValue}`)
        .catch((error) => {
          if (error.response.status === 404) {
            if (groupList.indexOf(inputValue) === -1) {
              setGroupList((prev) => [...prev, inputValue]);
            }
            else {
              toast.error(error.response.data.message);
            }
          } else {
            toast.error(error.response.data.message);
          }
          
        });
      if (res.status === 200) {
        setGroupList((prev) => [...prev, inputValue]);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex flex-col mt-16 relative">
      <div onClick={()=>{navigate('/employees')}} className="absolute top-10 right-28 px-12 py-4 rounded-xl bg-blue-300">Преподаватели БГУИР</div>
      <div className="flex justify-center items-center mt-10">
        <div className="">Номер группы</div>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-60 h-12 border-black border mx-2 rounded-lg outline-none px-3"
        />
        <button
          onClick={addGroupHandler}
          className="w-32 h-12 rounded-xl bg-blue-300"
        >
          Добавить
        </button>
      </div>
      {isLoading ? <Loader/> : groupList.length > 0 ? (
        <div
          style={{ width: "60%" }}
          className="w-full mt-10 flex flex-wrap justify-start items-center mx-auto"
        >
          {groupList.map((item) => (
            <div
              style={{ width: "33%" }}
              className="cursor-pointer flex items-center justify-center h-16 mb-5"
              onClick={() => navigate(`/group/${item}`)}
              key={item}
            >
              <div
                onMouseEnter={() => setHover(item)}
                onMouseLeave={() => setHover("")}
                className="w-60 h-16 bg-blue-200 flex items-center justify-center  rounded-3xl relative"
              >
                {item}
                {hover === item && (
                  <div className="absolute top-2 right-2 z-10" onClick={(e)=>{e.stopPropagation(); removeGroupHandler(item)}}>
                    <X color="#9a9996" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="mt-5">Нет добавленных групп</div>}
    </div>
  );
}

export default MainPage;
