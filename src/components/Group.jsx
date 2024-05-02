import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../CONSTS";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "./../components/Loader";
import clsx from "clsx";

function MainPage() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [hover, setHover] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function Init() {
      try {
        setLoading(true);
        const res = await axios
          .get(`${SERVER_URL}/getSchedule/${id}`)
          .catch((error) => {
            toast.error(error.response.data.message);
          });
        console.log(res.data);
        setSchedule(res.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (id) {
      Init();
    }
  }, [id]);
  if (isLoading) return <div> 
    <div className="absolute top-1 left-2 bg-blue-300 px-10 py-3 rounded-xl cursor-pointer" onClick={()=>navigate('/')}>Главная</div><Loader />
    </div>
  return (
    <div>
        <div className="absolute top-1 left-2 bg-blue-300 px-10 py-3 rounded-xl cursor-pointer" onClick={()=>navigate('/')}>Главная</div>
      <div className="font-bold text-3xl mb-10">
        Группа №{schedule.studentGroupDto.name}
      </div>
      <div className="flex">
      <div className="flex">
        {Object.keys(schedule.schedules).map((scheduleDay) => (
          <div key={scheduleDay} className="w-60">
            <div className="text-xl mb-4 font-bold">{scheduleDay}</div>
            {Object.values(schedule.schedules[scheduleDay]).map(
              (item, index) => {
                return (
                  <div
                    key={index}
                    className="h-16 p-4 bg-gray-400 mb-2 rounded-lg mx-2 flex items-center"
                  >
                    <div className="flex flex-col">
                      <div>{item.startLessonTime}</div>
                      <div>{item.endLessonTime}</div>
                    </div>
                    <div
                      className={clsx(
                        "w-2 h-10 ml-3 rounded-xl",
                        item.lessonTypeAbbrev === "ЛК" && "bg-green-400",
                        item.lessonTypeAbbrev === "ПЗ" && "bg-red-400",
                        item.lessonTypeAbbrev === "ЛР" && "bg-yellow-400",
                        (item.lessonTypeAbbrev === "Экзамен" || item.lessonTypeAbbrev === "Консультация")  && "bg-purple-400"
                      )}
                    ></div>
                    <div
                      className="ml-3 relative"
                      onMouseEnter={() => setHover(scheduleDay + index)}
                      onMouseLeave={() => setHover("")}
                    >
                      {item.subject}
                      {hover === scheduleDay + index && (
                        <div className="w-40 h-30  overflow-hidden top-0 rounded-xl bg-gray-200 z-10 left-0 absolute">
                          {item.subjectFullName}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ))}
      </div>
      <div className="w-full px-4">
        <div className="text-xl font-bold mb-5">Преподаватели</div>
        <div style={{maxHeight: '70vh'}} className="overflow-y-scroll">
            {Object.values(schedule.allEmployees).map((item,index) => (
            <div key={index} className="flex mb-5 bg-gray-400 rounded-2xl p-3 w-full">
                <img src={item.photoLink} width={70} height={70} alt="" className="rounded mr-3"/>
                <div>{item.lastName} {item.firstName} {item.middleName}</div>
            </div>
        ))}
        </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
