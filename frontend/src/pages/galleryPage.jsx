function galleryPage() {
    return(
        <div className="h-auto mt-24 p-5">
            <div className="grid grid-cols-5 grid-rows-5 gap-4">
                <div className="col-span-5 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">1</div>
                <div className="col-span-2 row-start-2 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">2</div>
                <div className="col-span-3 col-start-3 row-start-2 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">3</div>
                <div className="col-span-3 row-start-3 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">4</div>
                <div className="col-span-2 col-start-4 row-start-3 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">5</div>
                <div className="row-start-4 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">6</div>
                <div className="row-start-4 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">7</div>
                <div className="row-start-4 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">8</div>
                <div className="row-start-4 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">9</div>
                <div className="row-start-4 bg-amber-300 rounded-2xl h-64 bg-[url('./assets/image2.jpg')]">10</div>
            </div>
        </div>
    );
}

export default galleryPage;