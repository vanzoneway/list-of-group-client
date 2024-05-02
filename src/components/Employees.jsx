import { useEffect, useState } from "react";
import { SERVER_URL } from "../CONSTS";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Loader } from "./Loader";
import { useNavigate } from "react-router-dom";
function Employees() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [offset, setOffset] = useState(+searchParams.get("offset"));
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setSearching] = useState(false);
  const [AllHandler, setAllHandler] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    setInputValue("");
    setSearching(false);
    let query = "";

      query = `${SERVER_URL}/getAllEmployees`;
    
    async function Init() {
      setLoading(true);
      
      const res = await axios.get(query, {
        params: {
            offset,
            limit: 20
          }
      });
      //console.log(res)
      setLoading(false);
      setEmployees(res.data.content);
    }
    Init();
  }, [offset, AllHandler]);

  const searchHandler = async () => {
    if (inputValue.trim() !== "") {
      setSearching(true);
      setLoading(true);
      const res = await axios.get(
        `${SERVER_URL}/getEmployeeStartedWith/${inputValue}`
      );
      setLoading(false);
      setEmployees(res.data);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col items-center pb-20">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-10 py-5 px-8 bg-blue-300 rounded-2xl "
      >
        Главная
      </button>
      <div>
        <button
          onClick={() => {
            setAllHandler((prev) => !prev);
            setOffset(1);
            setSearchParams("offset=1");
          }}
          className="py-5 px-8 bg-blue-300 rounded-2xl mr-7"
        >
          Все преподаватели
        </button>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          className="px-5 rounded-2xl mt-6 border-black border outline-none py-4 text-xl mr-5"
          placeholder="Введите Имя..."
        />
        <button
          onClick={searchHandler}
          className="py-5 px-8 bg-blue-300 rounded-2xl"
        >
          Найти
        </button>
      </div>
      <div className="flex flex-wrap mt-12 mb-6 w-full">
        {employees && employees.length > 0 ? (
          employees.map((item) => (
            <div
              key={item.id}
              style={{ width: "33%" }}
              className="flex items-center justify-center"
            >
              <div
                style={{ width: "70%" }}
                className="flex mt-6 p-4 bg-gray-400 items-center rounded-2xl"
              >
                <img
                  src={item.photoLink}
                  width={70}
                  height={70}
                  className="max-w-20 mr-4 max-h-20 rounded-lg"
                ></img>
                <div className="flex flex-col">
                  <div className="mb-3">
                    {item.lastName} {item.firstName} {item.middleName}
                  </div>
                  {item.email && <div>{item.email}</div>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-full text-3xl">Нет данных</div>
        )}
      </div>
      {!isSearching && (
        <div
          style={{ width: "50%" }}
          className="flex items-center justify-around w-full mt-10"
        >
          <button
            disabled={offset < 2}
            onClick={() => {
              setOffset((prev) => +prev - 1);
              setSearchParams(`offset=${+offset - 1}`);
            }}
            className="py-5 px-8 bg-blue-300 rounded-2xl"
          >
            Назад
          </button>
          <button
            onClick={() => {
              if (offset === 0) {
                setOffset(2);
                setSearchParams("offset=2");
              } else {
                setOffset((prev) => +prev + 1);
                setSearchParams(`offset=${+offset + 1}`);
              }
            }}
            className="py-5 px-8 bg-blue-300 rounded-2xl"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
}
export default Employees;
