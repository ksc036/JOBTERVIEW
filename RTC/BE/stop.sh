process=$(sudo lsof -i :4060 | awk '$1=="node"{print $2}'| head -n 1)
if [ -n "$process" ]; then
    echo "포트 4060을 사용하는 프로세스($process)를 종료합니다."
    sudo kill "$process"
else
    echo "포트 4060을 사용하는 프로세스가 없습니다."
fi
