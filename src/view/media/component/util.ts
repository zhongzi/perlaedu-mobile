function getPhotoZoneFromFrame(
  framePosition: perlaedu.Position,
  photoSize: perlaedu.Size
): perlaedu.Position {
  const { width, height, left, top } = framePosition;
  const { width: pWidth, height: pHeight } = photoSize;

  const bottom = framePosition.bottom || top;
  const right = framePosition.right || left;

  const validWidth = width - (left + right);
  const validHeight = height - (top + bottom);

  const ratio = Math.min(validWidth / pWidth, validHeight / pHeight);

  const computedWidth = Math.floor(pWidth * ratio);
  const computedHeight = Math.floor(pHeight * ratio);
  const computedLeft = left + Math.floor((validWidth - computedWidth) / 2);
  const computedTop = top + Math.floor((validHeight - computedHeight) / 2);

  const ret = {
    width: computedWidth,
    height: computedHeight,
    left: computedLeft,
    top: computedTop,
  };
  return ret;
}

export { getPhotoZoneFromFrame };
