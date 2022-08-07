
function Call() {

    return (
        <div>
            <div class="input-group margin-bottom-sm">
                <span class="input-group-addon"><i class="fa fa-phone fa-fw"></i></span>
                <input class="form-control" type="text" placeholder="Who should we call?" autocomplete="off" id="peer" onkeypress="return checkEnter(this, event);" />
            </div>
            <button class="btn btn-success margin-bottom-sm" autocomplete="off" id="call">Call</button>
        </div>
    )

}