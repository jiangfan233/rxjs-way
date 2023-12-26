### 问题背景

- 使用react-router-dom进行单页面路由跳转；

### 需求

- 点击同一个URL给用户页面刷新的反馈；

### 解决方案

- 利用 <Outlet /> 组件、location和key控制组件创建与销毁；
- 利用 location 和 ref 实现路由监听；

```typescript
const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [key, setKey] = useState(location.key);
  const [isTransition, setIsTransition] = useState(false);

  const urlRef = useRef(location.pathname + location.search);

  // 使用 useMemo、React.memo 缓存其他组件
  const header = useMemo(() => {
    // console.log("header");
    return (
      <>
        <div>
          <Link to={"/"}>Hello world! {new Date().getTime()}</Link>
        </div>
        <div>
          <span onClick={() => navigate("/a?id=1")} className="">
            <p>A</p>
          </span>
          <span onClick={() => navigate("/a?id=2")} className="">
            <p>A</p>
          </span>
          <Link to={"/b"} className="">
            <p>B</p>
          </Link>
        </div>
      </>
    );
  }, [navigate]);

  // 每次点击页面链接，都会生成一个全新的location对象
  // 即使点击同一个链接也会生成一个全新的、独一无二的location.key
  useEffect(() => {
    if (location.pathname + location.search == urlRef.current) {
      setKey(location.key);
    } else {
      urlRef.current = location.pathname + location.search;
    }

    // 实现简易切换页面动画
    setIsTransition(true);
    setTimeout(() => {
      setIsTransition(false);
    }, 100);
  }, [location]);

  return (
    <div>
      {header}
      <div
        className=""
        style={{ height: "60vh", width: "100%", position: "relative" }}
      >
        {/* {isTransition ? "transition..." : <Outlet key={key} />} */}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "50vh",
            zIndex: isTransition ? 10000 : -9999,
            // visibility: isTransition ? "visible" : "hidden",
            filter: "blur(10px)",
            background: isTransition ? "rgba(255,255,255,.7)" : "transparent",
            transition: "all 0.2s ease-in",
          }}
        ></div>
        <Outlet key={key} />

        {/* <Outlet /> */}
      </div>
    </div>
  );
};
```