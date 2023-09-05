import { apiTest } from "./apiTest";

//맴버 목록 조회
async function getMemberListApi({ page, size, sort }, success, fail) {
  await apiTest
    .get(`/member/list?page=${page - 1}&size=${size}&sort=${sort}`)
    .then(success)
    .catch(fail);
}

async function searchMemberApi({ keyword, page, size, sort }, success, fail) {
  await apiTest
    .get(
      `/member?page=${page - 1}&size=${size}&sort=${sort}&keyword=${keyword}`
    )
    .then(success)
    .catch(fail);
}

async function isAdmin(nickname, success, fail) {
  await apiTest
    .get(`/member/isadmin?nickname=${nickname}`)
    .then(success)
    .catch(fail);
}

async function updatePassword(member, success, fail) {
  await apiTest.put(`/member`, member).then(success).catch(fail);
}

async function resetPassword(member, success, fail) {
  await apiTest.put(`/member/resetPassword`, member).then(success).catch(fail);
}

async function withdrawMember(member, success, fail) {
  await apiTest.put(`/member/withdraw`, member).then(success).catch(fail);
}

export {
  getMemberListApi,
  searchMemberApi,
  updatePassword,
  resetPassword,
  withdrawMember,
  isAdmin,
};
