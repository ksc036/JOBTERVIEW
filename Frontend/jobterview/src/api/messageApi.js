import { apiTest } from "@/api/apiTest";

//전체 메시지 조회
async function getMessageList({ page, size, sort }, success, fail) {
  await apiTest
    .get(`/message?page=${page - 1}&size=${size}&sort=${sort}`)
    .then(success)
    .catch(fail);
}

// 수신 메시지 조회
async function receiveMessageList({ nickname, page }, success, fail) {
  await apiTest
    .get(`/message/me?nickname=${nickname}&page=${page}`)
    .then(success)
    .catch(fail);
}
// 송신 메시지 조회
async function sendMessageList({ nickname, page }, success, fail) {
  await apiTest
    .get(`/message/send?nickname=${nickname}&page=${page}`)
    .then(success)
    .catch(fail);
}
// 수신 메시지 삭제
async function deleteReceivedMessage(id, success, fail) {
  await apiTest.put(`/message/from/${id}`).then(success).catch(fail);
}
// 송신 메시지 삭제
async function deleteSentMessage(id, success, fail) {
  await apiTest.put(`/message/to/${id}`).then(success).catch(fail);
}
// 메시지 전송
async function postMessage(message, success, fail) {
  await apiTest.post(`/message`, message).then(success).catch(fail);
}

export {
  receiveMessageList,
  sendMessageList,
  deleteReceivedMessage,
  deleteSentMessage,
  postMessage,
  getMessageList,
};
