
export default () => {

    return (
        <div className="w-screen h-screen flex items-center">
            <div className="mx-auto">
                <h2 className="text-red-600 text-lg mb-2">认证失败</h2>
                <p className="text-gray-600">
                    认证过程发生中发生错误，
                    <span className="text-blue-600 cursor-pointer" onClick={() => location.reload()}>重新加载</span>
                </p>
            </div>
        </div>
    )
}