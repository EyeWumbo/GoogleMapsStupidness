interact('.resize')
    .resizable(true)
    .on('resizemove', function(e){
      var target = e.target;
      var newWidth = parseFloat(target.style.width) + event.movementX,
      newHeight = parseFloat(target.style.height) + event.movementY;
      console.log(newWidth + ' ' + newHeight)
      target.style.width = newWidth + 'px';
      target.style.height = newHeight + 'px';
    });

interact('.drag')
  .draggable({
    inertia: true,
    restrict: {
      endOnly: true
    },
    onmove: function(e) {
      var target = e.target,
      x = (parseFloat(target.getAttribute('data-x' )) || 0) + event.movementX,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.movementY;

      target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
  });