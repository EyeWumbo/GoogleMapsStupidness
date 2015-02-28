hitbox_style = {
  width: '20px',
  height: '20px'
}

var Hitbox = React.createClass({
  render: function(){
    return <div className='hitbox resize drag' style={hitbox_style}></div>;
  }
})

$(document).ready(function(){

  $('#add-rectangle').click(function(e){
    e.preventDefault();
    React.render(<Hitbox></Hitbox>, document.getElementById('map-canvas'));
  })
});