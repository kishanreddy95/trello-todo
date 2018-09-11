// For getting cards
// https://api.trello.com/1/boards/{boardId}/cards
// https://api.trello.com/1/boards/{boardId}/?cards=all
// https://api.trello.com/1/cards/[card id]/checklist/[checklist id]/checkItem/[checkitem id]/state?key=[your api key]&token=[your trello token]&value=false
// For perfoming actions just append /actions in place of cards


// Key and Tokens required to access the trello api

const key = '8e88c7a234c5ae0df7a0ca91a6894d69';
const token = '6eb43811bec9dab09bea76cc7327617fe3a990858ebf9e11962cd717165e37f5';
const trelloLink = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`;

// Getting all cards from trello-todo-board

fetch(trelloLink)
  .then((response) => {
    return response.json();
  })
  .then((allBoards) => {
    let boardRequired = allBoards.reduce((acc, val) => {
      if (val.name == "Trello Todo Board") {
        return val;
      }
      return acc;
    }, {});
    return boardRequired;
  })
  .then((board) => {
    return fetch(`https://api.trello.com/1/boards/${board.id}/cards`).then((response) => {
      console.log(response);
      return response.json();
    })
  })
  .then((cards) => {
    console.log(cards);
    let checkLists = cards.map((card) => {
      return (card.idChecklists); //Getting every id of checklistss
    }).reduce((acc, val) => {
      return acc.concat(val); //Flatten the array of checklists
    }, []);
    return checkLists;
  })
  .then((checkLists) => {
    let checkListItems = checkLists.map((checkList) => {
      return fetch(`https://api.trello.com/1/checklists/${checkList}?fields=all`).then((response) => {
        return response.json();
      }).then((items) => {
        let item = items.checkItems.map((item) => {
          return item;
        });
        return item;
      });
    });
    return Promise.all(checkListItems).then((values) => {
      return values.reduce((acc, val) => {
        return acc.concat(val);
      }, []);
    });
  })
  .then((arrayOfChecklists) => {
    controllers.appendIncompleteChecklists(arrayOfChecklists);
    return arrayOfChecklists;
  })
  .then((arrayOfChecklists) => {
    // JQuery for button clicks
    $("button").click(function () {
      $(this).prev().css("text-decoration", "line-through");
      let text = $(this).prev().text();
      let checkItem = arrayOfChecklists.reduce((checkItem, checkitem) => {
        if (checkitem.name == text) {
          return checkitem;
        }
        return checkItem;
      });
      fetch(trelloLink)
        .then((response) => {
          return response.json();
        })
        .then((allBoards) => {
          let boardRequired = allBoards.reduce((requiredBoard, board) => {
            if (board.name == "Trello Todo Board") {
              return board;
            }
            return requiredBoard;
          }, {});
          return boardRequired;
        })
        .then((board) => {
          return fetch(`https://api.trello.com/1/boards/${board.id}/cards`).then((response) => {
            return response.json();
          })
        })
        .then((cards) => {
          let cardId = cards.reduce((cardId, card) => {
            if (card.idChecklists.indexOf(checkItem.idChecklist) != -1) {
              return card.id;
            }
            return cardId;
          }, {});
          return cardId;
        })
        .then((cardId) => {
          let request = new Request(`https://api.trello.com/1/cards/${cardId}/checklist/${checkItem.idChecklist}/checkItem/${checkItem.id}/state?key=${key}&token=${token}&value=true`, {
            method: 'PUT',
          });
          fetch(request)
            .then((response) => {
              console.log(response);
            });
        });
    });
  });




// Functions for updating the dom

let controllers = {
  appendIncompleteChecklists: function (checkListItems) {
    checkListItems.forEach((checklist) => {
      if (checklist.state == 'incomplete') {
        $(".list-group").append(`<div class="row">
        <p class="list-group-item list-group-item-secondary col-md-11">${checklist.name}</p>
        <button class="btn btn-dark col-md-1" type="button">Done</button>
        </div>`);
      }
    });
  },
};