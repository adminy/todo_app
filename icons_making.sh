allIcons=(20 29 40 48 50 55 57 58 60 72 76 80 87 88 100 114 120 144 152 167 172 180 196 216 1024)
icons=""
for x in ${allIcons[@]}; do
    ffmpeg -y -i www/img/icon.png -vf scale=$x:$x www/img/icons/tmp.png
    ffmpeg -y -i www/img/icons/tmp.png -filter_complex "color=black,format=rgb24[c];[c][0]scale2ref[c][i];[c][i]overlay=format=auto:shortest=1,setsar=1" www/img/icons/$x.png
    icons="$icons\n<icon src=\"www/img/icons/$x.png\" width=\"$x\" height=\"$x\" />"
done
rm -rf www/img/icons/tmp.png
echo $icons
