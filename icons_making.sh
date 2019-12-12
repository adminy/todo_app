allIcons=(20 29 40 48 50 55 57 58 60 72 76 80 87 88 100 114 120 144 152 167 172 180 196 216 1024)
for x in ${allIcons[@]}; do
    ffmpeg -y -i www/img/icon.png -vf scale=$x:$x www/img/icons/$x.png
done
for x in ${allIcons[@]}; do
    echo "<icon src=\"www/img/icons/$x.png\" width=\"$x\" height=\"$x\" />"
done