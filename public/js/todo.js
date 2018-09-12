
fetch('../index.js').then((response) => {
  console.log(response);
});


// Functions for updating the dom

// const controllers = {
//   appendIncompleteChecklists (checkListItems) {
//     checkListItems.forEach((checklist) => {
//       if (checklist.state == 'incomplete') {
//         $(".list-group").append(`<div class="row">
//         <p class="list-group-item list-group-item-secondary col-md-11">${checklist.name}</p>
//         <button class="btn btn-dark col-md-1" type="button">Done</button>
//         </div>`);
//       }
//     });
//   },
// };
