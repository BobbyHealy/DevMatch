export const promoteUser = async (uid, pid) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    redirect: "follow",
  };

  var raw = JSON.stringify({
    pid: pid,
    uid: uid,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  await fetch("http://localhost:3000/api/promoteRole", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export const demoteUser = async (uid, pid) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    redirect: "follow",
  };

  var raw = JSON.stringify({
    pid: pid,
    uid: uid,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  await fetch("http://localhost:3000/api/demoteRole", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export const handleRoleChange = async (role, newRole, uid, pid) => {
  if (role == newRole) {
    window.location.reload(false);
  }

  switch (role) {
    case "team member":
      if (newRole === "owner") {
        await promoteUser(uid, pid);
        await promoteUser(uid, pid);
      }
      if (newRole === "admin") {
        await promoteUser(uid, pid);
      }
      break;
    case "admin":
      if (newRole === "owner") {
        await promoteUser(uid, pid);
      }
      if (newRole === "team member") {
        await demoteUser(uid, pid);
      }
      break;
    case "owner":
      if (newRole === "team member") {
        await demoteUser(uid, pid);
        await demoteUser(uid, pid);
      }
      if (newRole === "admin") {
        await demoteUser(uid, pid);
      }
      break;
  }

  window.location.reload(false);
};
