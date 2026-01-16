import os
from typing import Union, List


def delete_file(file_path: Union[str, List[str]]) -> bool:
    """
    주어진 파일 경로의 파일을 삭제하는 함수입니다.

    Args:
        file_path (Union[str, List[str]]): 삭제할 파일의 경로 또는 경로 목록

    Returns:
        bool: 모든 파일이 성공적으로 삭제되었으면 True, 그렇지 않으면 False

    Examples:
        >>> delete_file("/path/to/file.mp4")  # 단일 파일 삭제
        True
        >>> delete_file(["/path/to/file1.mp4", "/path/to/file2.wav"])  # 여러 파일 삭제
        True
    """
    # 단일 경로인 경우 리스트로 변환
    if isinstance(file_path, str):
        file_paths = [file_path]
    else:
        file_paths = file_path

    success = True

    # 각 파일에 대해 삭제 시도
    for path in file_paths:
        try:
            # 파일이 존재하는지 확인
            if os.path.exists(path):
                # 파일 삭제
                os.remove(path)
                print(f"파일이 삭제되었습니다: {path}")
            else:
                print(f"파일이 존재하지 않습니다: {path}")
                success = False
        except Exception as e:
            print(f"파일 삭제 중 오류 발생: {path}, 오류: {str(e)}")
            success = False

    return success
