
import './App.css';
import { graphql } from "@octokit/graphql";
import { useEffect, useState } from 'react';
const query =
  `{
    repository(name: "agora-states-fe", owner: "codestates-seb") {
      discussions(first: 10) {
        edges {
          node {
            id
            title
            createdAt
            url
            author {
              login
              avatarUrl
            }
            category {
              name
            }
            answer {
              author {
                login
              }
            }
          }
        }
      }
    }
  }`
const token = 'token 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'
// useEffect의 의존성 배열
// useEffect 후크는 데이터 가져 오기를위한 비동기 함수를 호출하는 데 사용됩니다.
// 그러나 useEffect는 의존성 배열이 없기 때문에 초기 렌더링 후에 한 번만 실행됩니다.
// 이 의존성 배열은 데이터가 변경 될 때마다 useEffect를 다시 실행하도록하며, 
// 무한 루프를 방지합니다.여기서는 getData를 호출하면 의존성 배열이 변경되도록[]를 추가해야합니다.
function App() {
  const [agoraRespository, setAgoraRespository] = useState([]);
  const getData = async () => {
    const { repository } = await graphql(query,
      {
        headers: {
          authorization: token,
        },
      }
    ); return repository;
  }
  useEffect(() => {
    getData()
      .then((data) => {
        setAgoraRespository(data.discussions.edges)
      })
      .catch(error => console.log(Error, error))
  }, [])

  return (
    <div className="App">
      <ul>
        {agoraRespository.map((edge) => {
          return (
            <li key={edge.node.id}>
              <img
                src={edge.node.author.avatarUrl}
                alt={`avatar of ${edge.node.author.login}`}
              />
              <div>{`[${edge.node.category.name}]`}</div>
              <a href={edge.node.url}>{edge.node.title}</a>
              <p>{edge.node.answer ? "☑" : "☒"}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
