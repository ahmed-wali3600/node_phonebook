'use strict'

const action_modal=bootstrap.Modal.getOrCreateInstance(document.getElementById('action_modal'));
const table_container = document.getElementById('table_container');

table_update_btn_functionality();


function table_update_btn_functionality(){

    table_container.addEventListener('click',function(event){

        
        if(event.target.className.includes('update_btn')){

            // alert("Button envoked");
            let contact_id = event.target.getAttribute('data-cid');
            let contact_number = event.target.getAttribute('data-cnumber');
            let contact_name = event.target.getAttribute('data-cname');
            let contact_number_id = event.target.getAttribute('data-cnid');


            let contact_data_obj = {
                contact_number_id : contact_number_id,
                contact_id : contact_id,
                contact_number : contact_number,
                contact_name : contact_name
            }

        }
    });
}









function create_action_modal_content(modal_type,data_obj){

    let modal_structure=``;

    if(modal_type==="update_data_modal")
    {
        modal_structure=`

            <form action="#" method="put">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Update Contact</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>


                <div class="modal-body">
                    <table>
                        
                    </table>
                    
                </div>


                <div class="modal-footer">
                    <button type="button" class="btn btn-success">Update</button>
                    <input type="submit" value="Update">
                </div>
            <form>       
        `;
    }

}