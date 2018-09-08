// For getting cards
// https://api.trello.com/1/boards/{boardId}/cards
// https://api.trello.com/1/boards/{boardId}/?cards=all


// For perfoming actions just append /actions in place of cards

const key = '8e88c7a234c5ae0df7a0ca91a6894d69';
const token = '6eb43811bec9dab09bea76cc7327617fe3a990858ebf9e11962cd717165e37f5';

// Getting all cards from trello-todo-board

fetch(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`).then((response) => {
  if (response.status !== 200) {
    console.log(`Data not found${response.status}`);
  } else {
    return response.json().then((board) => {
      return board[1].id ;
    });
  }
}).then((link) => {
   return fetch(`https://api.trello.com/1/boards/${link}/cards`).then((response) => {
      if(response.status !== 200) {
        console.log(`Data not found${response.status}`);
      } else {
        return response.json().then((cards) => {
          return cards;
         });
      }
    }).then((card) => {
      
      let checkListIds = Object.keys(card).map((key) => {
        return (card[key].idChecklists);
      });
      console.log(checkListIds);
      let checkListId = checkListIds.map(id => id[0])
      console.log(checkListId);
      
      fetch(`https://api.trello.com/1/checklists/${checkListIds[1][0]}?fields=all`).then((response) => {
        if(response.status !== 200) {
          console.log(`Data not found${response.status}`);
        } else {
          response.json().then((values) => {
            console.log(values);
          });
        }
      });
  });
})




// .then((data) => {
//   let arr = data.map((obj) => {
//     return obj.idChecklists;
//   });
//   fetch(`https://api.trello.com/1/checklists/`)
// });