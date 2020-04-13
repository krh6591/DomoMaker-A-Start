"use strict";

// Limit which domos are rendered based on selected team
var controlRender = function controlRender() {
  var selected = document.querySelector("#renderedTeam").selectedOptions[0].value;
  console.log(selected);
  var all = selected === "All";
  var red = selected === "Red";
  var blu = selected === "Blue";
  var domosBlu = document.getElementsByClassName("domo");
  var domosRed = document.getElementsByClassName("domoRed"); // Disable or enable viewing of all blue domos

  for (var i = 0; i < domosBlu.length; ++i) {
    if (all || blu) {
      domosBlu[i].style.display = "block";
    } else {
      domosBlu[i].style.display = "none";
    }
  } // Disable or enable viewing of all red domos


  for (var _i = 0; _i < domosRed.length; ++_i) {
    if (all || red) {
      domosRed[_i].style.display = "block";
    } else {
      domosRed[_i].style.display = "none";
    }
  }
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
  controlRender();
};

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() === '' || $("#domoAge").val() === '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "domoForm",
      name: "domoForm",
      onSubmit: handleDomo,
      action: "/maker",
      method: "POST",
      className: "domoForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "domoName",
      type: "text",
      name: "name",
      placeholder: "Domo Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "domoAge",
      type: "text",
      name: "age",
      placeholder: "Domo Age"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "team"
    }, "Team: "), /*#__PURE__*/React.createElement("select", {
      id: "domoTeam",
      name: "team",
      form: "domoForm",
      selected: "Blue"
    }, /*#__PURE__*/React.createElement("option", {
      value: "Blue"
    }, "Blue"), /*#__PURE__*/React.createElement("option", {
      value: "Red"
    }, "Red")), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      valu: "Make Domo"
    }))
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "domoList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyDomo"
      }, "No Domos yet"))
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    // Display teams by using different-colored bases
    var domoClass = domo.team ? "domoRed" : "domo";
    console.log(domo.team);
    return (/*#__PURE__*/React.createElement("div", {
        key: domo._id,
        className: domoClass
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "domo face",
        className: "domoFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "domoName"
      }, " Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
        classNAme: "domoAge"
      }, " Age: ", domo.age, " "))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, domoNodes)
  );
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos")); // Limit rendered domos to the selected team; update on change
  // $("#renderedTeam").addEventListener("change", controlRender);

  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
