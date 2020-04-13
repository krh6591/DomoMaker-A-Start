// Limit which domos are rendered based on selected team
const controlRender = () => {
  let selected = document.querySelector("#renderedTeam").selectedOptions[0].value;
  
  const all = selected === "All";
  const red = selected === "Red";
  const blu = selected === "Blue";
  
  const domosBlu = document.getElementsByClassName("domo");
  const domosRed = document.getElementsByClassName("domoRed");
  
  // Disable or enable viewing of all blue domos
  for (let i = 0; i < domosBlu.length; ++i) {
    if (all || blu) {
      domosBlu[i].style.display = "block";
    }
    else {
      domosBlu[i].style.display = "none";
    }
  }
  
  // Disable or enable viewing of all red domos
  for (let i = 0; i < domosRed.length; ++i) {
    if (all || red) {
      domosRed[i].style.display = "block";
    }
    else {
      domosRed[i].style.display = "none";
    }
  }
}

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
  
  controlRender();
};

const handleDomo = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({ width: 'hide' }, 350);
  
  if ($("#domoName").val() === '' || $("#domoAge").val() === '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer();
  });
  
  return false;
};


const DomoForm = (props) => {
  return (
    <form id="domoForm"
    name="domoForm"
    onSubmit={handleDomo}
    action="/maker"
    method="POST"
    className="domoForm"
    >
    <label htmlFor="name">Name: </label>
    <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
    <label htmlFor="age">Age: </label>
    <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
    <label htmlFor="team">Team: </label>
    <select id="domoTeam" name="team" form="domoForm" selected="Blue">
      <option value="Blue">Blue</option>
      <option value="Red">Red</option>
    </select>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input className="makeDomoSubmit" type="submit" valu="Make Domo" />
    </form>
  );
};

const DomoList = function(props) {
  if (props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map(function(domo) {
    // Display teams by using different-colored bases
    const domoClass = domo.team ? "domoRed" : "domo";
    console.log(domo.team);
    return (
      <div key={domo._id} className={domoClass}>
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName"> Name: {domo.name} </h3>
        <h3 classNAme="domoAge"> Age: {domo.age} </h3>
      </div>
    );
  });
  
  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
  
  ReactDOM.render(
    <DomoList domos={[]} />, document.querySelector("#domos")
  );
  
  // Limit rendered domos to the selected team; update on change
  // $("#renderedTeam").addEventListener("change", controlRender);
  
  loadDomosFromServer();
}

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
