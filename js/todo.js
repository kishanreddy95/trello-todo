// For getting cards
// https://api.trello.com/1/boards/{boardId}/cards
// https://api.trello.com/1/boards/{boardId}/?cards=all


// For perfoming actions just append /actions in place of cards

const key = '8e88c7a234c5ae0df7a0ca91a6894d69';
const token = '6eb43811bec9dab09bea76cc7327617fe3a990858ebf9e11962cd717165e37f5';
const trelloLink = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`;

// Getting all cards from trello-todo-board

// fetch(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`).then((response) => {
//   if (response.status !== 200) {
//     console.log(`Data not found${response.status}`);
//   } else {
//     return response.json().then((board) => {
//       return board[1].id ;
//     });
//   }
// }).then((link) => {
//    return fetch(`https://api.trello.com/1/boards/${link}/cards`).then((response) => {
//       if(response.status !== 200) {
//         console.log(`Data not found${response.status}`);
//       } else {
//         return response.json().then((cards) => {
//           return cards;
//          });
//       }
//     }).then((card) => {
      
//       let checkListIds = Object.keys(card).map((key) => {
//         return (card[key].idChecklists);
//       });
//       console.log(checkListIds);
//       let checkListId = checkListIds.map(id => id[0])
//       console.log(checkListId);
      
//       fetch(`https://api.trello.com/1/checklists/${checkListIds[1][0]}?fields=all`).then((response) => {
//         if(response.status !== 200) {
//           console.log(`Data not found${response.status}`);
//         } else {
//           response.json().then((values) => {
//             console.log(values);
//           });
//         }
//       });
//   });
// })



fetch(trelloLink)
  .then((response) => {
    return response.json();
  })
  .then((allBoards) => {
    let boardRequired = allBoards.reduce((acc, val) => {
      if(val.name == "Trello Todo Board") {
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
    let checkLists = cards.map((card) => {
      return (card.idChecklists); //Getting every 
    }).reduce((acc, val) => {
      return acc.concat(val); //Flatten the array of checklists
    },[]);
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
      },[]);
    });
  })
  .then((arrayOfChecklists) => {
    controllers.appendIncompleteChecklists(arrayOfChecklists);
  });



// Functions for updating the dom.

let controllers = {
  appendIncompleteChecklists: function(checkListItems) {
    checkListItems.forEach((checklist) => {
      if(checklist.state == 'incomplete') {
        $(".list-group").append(`<div class="row">
        <p class="list-group-item list-group-item-secondary col-md-11">${checklist.name}</p>
        <button class="btn btn-dark col-md-1" type="button">Done</button>
        </div>`);
      }
    });
  }
};