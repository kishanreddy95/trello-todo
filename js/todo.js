
// Global key and token values

const key = '';
const token = '';
const trelloLink = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`;

// Getting all cards from trello-todo-board

fetch(trelloLink)
  .then((response) => {
    return response.json();
  })
  .then(allBoards => allBoards[1].id)
  .then((board) => {
    return fetch(`https://api.trello.com/1/boards/${board}/cards`).then(response => response.json())
  })
  .then((cards) => {
    let checkLists = cards.map((card) => {
      return (card.idChecklists); //Getting every id of checklistss
    }).reduce((acc, val) => {
      return acc.concat(val); //Flatten the array of checklists
    }, []);
    return checkLists;
  })
  .then((checkLists) => {
    let checkListItems = checkLists.map((checkList) => {
      return fetch(`https://api.trello.com/1/checklists/${checkList}?fields=all`).then(response => response.json())
      .then((items) => {
        let item = items.checkItems.map((item) => {
          return item;
        });
        return item;
      }).catch(err => console.log(err));
    });
    return Promise.all(checkListItems).then((values) => {
      return values.reduce((acc, val) => {
        return acc.concat(val);
      }, []);
    });
  })
  .then((arrayOfChecklists) => {
    controllers.appendIncompleteChecklists(arrayOfChecklists);
     // JQuery for button clicks
     $("button").click(function () {
      $(this).prev().css("text-decoration", "line-through");
      let id = $(this).attr('id');
      let checkItem = arrayOfChecklists.reduce((checkItem, checkitem) => {
        if (checkitem.id == id) {
          return checkitem;
        }
        return checkItem;
      });
      // Sending a put request
      fetch(trelloLink)
        .then(response => response.json())
        .then((allBoards) => {
          let boardRequired = allBoards[1].id;
          return boardRequired;
        })
        .then((board) => {
          return fetch(`https://api.trello.com/1/boards/${board}/cards`).then(response => response.json())
          .then((cards) => {
             let cardId = cards.filter((card) => {
              if (card.idChecklists.indexOf(checkItem.idChecklist) != -1) {
                return card.id;
              }
             });
             return cardId;
          }).catch(err => console.log(err));
        })
        .then((cardId) => {
          // Manipulating state of check items
          let request;
          if(checkItem.state == 'incomplete') {
            checkItem.state = 'complete';
            $(this).text('undo');
            request = new Request(`https://api.trello.com/1/cards/${cardId[0].id}/checkItem/${checkItem.id}?key=${key}&token=${token}&state=complete`, {
            method: 'PUT',
             });
          } else {
            checkItem.state = 'incomplete'
            $(this).text('done');
            $(this).prev().css("text-decoration", "none");
            request = new Request(`https://api.trello.com/1/cards/${cardId[0].id}/checkItem/${checkItem.id}?key=${key}&token=${token}&state=incomplete`, {
            method: 'PUT',
           });
          }
          fetch(request).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
  }).catch(err => console.log(err));


// Functions for updating the dom
let controllers = {
  appendIncompleteChecklists: function (checkListItems) {
    checkListItems.forEach((checklist) => {
      if (checklist.state == 'incomplete') {
        $(".list-group").append(`<div class="row">
        <p class="list-group-item list-group-item-secondary col-md-11">${checklist.name}</p>
        <button id=${checklist.id} class="btn btn-dark col-md-1" type="button">Done</button>
        </div>`);
      }
    });
  },
};