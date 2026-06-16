export type PhotoCategory = "cute" | "couple" | "funny" | "memory";

export type PhotoItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: PhotoCategory;
};

const photoCounts: Record<PhotoCategory, number> = {
  cute: 5,
  couple: 3,
  funny: 8,
  memory: 12,
};

const categoryLabels: Record<PhotoCategory, string> = {
  cute: "Ảnh tử tế hiếm hoi",
  couple: "Bằng chứng phát cơm chó",
  funny: "Ảnh dìm nhưng vẫn yêu",
  memory: "Những khoảnh khắc đáng nhớ",
};

const photoCaptions: Record<PhotoCategory, string[]> = {
  cute: [
    "Tấm này nhìn cũng ra dáng nhân vật chính đó.",
    "Đáng yêu vừa đủ để được đưa vào hồ sơ.",
    "Một khoảnh khắc tử tế hiếm hoi nhưng rất đáng lưu lại.",
    "Nhìn vậy thôi chứ hệ thống đánh giá là dễ thương.",
    "Ảnh này không cà khịa được, vì thật sự quá ổn.",
    "Bằng chứng cho thấy đáng yêu là một thói quen.",
    "Một chiếc ảnh nhẹ nhàng nhưng điểm dễ thương hơi cao.",
    "Tạm tha tấm này vì nhìn quá ngoan.",
    "Ảnh tử tế đến mức hồ sơ phải lưu riêng.",
    "Khoảnh khắc này xứng đáng được đóng dấu đáng yêu.",
    "Không cần diễn nhiều, tự nhiên vậy là đủ đẹp rồi.",
    "Tấm này có vẻ bình thường nhưng lại rất có vibe.",
    "Một pha dễ thương vượt ngưỡng kiểm duyệt.",
    "Đề nghị lưu lại để sau này còn đem ra trêu.",
    "Ảnh này nhìn càng lâu càng thấy đáng yêu.",
    "Một chiếc ảnh rất hợp để đưa vào mục tử tế.",
    "Khoảnh khắc này được hệ thống đánh giá khá cao.",
    "Tấm này không cần chỉnh nhiều, vì đã đủ ổn.",
    "Đáng yêu nhưng vẫn phải lưu hồ sơ để theo dõi.",
    "Tấm cuối vẫn giữ phong độ đáng yêu ổn định.",
  ],

  couple: [
    "Không ai hỏi nhưng vẫn ngọt.",
    "Bằng chứng phát cơm chó đã được ghi nhận.",
    "Mức độ tình cảm: hơi nguy hiểm.",
    "Ảnh này đề nghị người xem chuẩn bị tinh thần trước.",
    "Một khoảnh khắc khiến hội độc thân hơi nhói.",
    "Cặp đôi chính thức bị đưa vào diện cần chúc phúc.",
    "Không cần nói nhiều, nhìn ảnh là hiểu.",
    "Tấm này có dấu hiệu phát đường quá liều.",
    "Hệ thống phát hiện lượng ngọt vượt mức cho phép.",
    "Bằng chứng không thể chối cãi trong hồ sơ.",
    "Một khoảnh khắc rất hợp để bị bạn bè cà khịa.",
    "Nhìn bình thường thôi nhưng độ tình cảm hơi cao.",
    "Tấm này nên được gắn nhãn: cơm chó chất lượng cao.",
    "Cặp đôi này cần được theo dõi thêm vì quá đáng nghi.",
    "Chúc phúc thì chúc phúc, nhưng vẫn phải cà khịa.",
    "Ảnh này có dấu hiệu làm người xem mỉm cười.",
    "Một khoảnh khắc ngọt vừa đủ để lưu lại.",
    "Hồ sơ xác nhận: hai nhân vật này khá hợp nhau.",
    "Cảnh báo: ảnh có thể gây sâu răng nhẹ.",
    "Tấm này khép lại bằng một lượng đường vừa đủ.",
  ],

  funny: [
    "Tụi mình đã rất nhân đạo khi không đăng thêm 50 tấm nữa.",
    "Ảnh này không dìm, ảnh này chỉ nói sự thật.",
    "Một khoảnh khắc cần được lưu lại để làm tư liệu.",
    "Tấm này mà bỏ qua thì hơi phí.",
    "Không biết ai chụp, nhưng xin cảm ơn.",
    "Ảnh dìm nhưng vẫn yêu, đúng tinh thần hồ sơ.",
    "Khoảnh khắc này có giá trị giải trí rất cao.",
    "Đề nghị nhân vật chính bình tĩnh khi xem lại.",
    "Tấm này chỉ dùng cho mục đích chúc mừng, không hề cà khịa.",
    "Một pha biểu cảm đi vào lịch sử.",
    "Hồ sơ ghi nhận: độ hài hước vượt chuẩn.",
    "Ảnh này xứng đáng được bảo tồn.",
    "Không đẹp nhất nhưng chắc chắn đáng nhớ nhất.",
    "Tấm này nhìn một lần là muốn lưu lại liền.",
    "Xin lỗi trước, nhưng ảnh này quá hợp để đăng.",
    "Đây là tư liệu quý, không thể xóa.",
    "Khoảnh khắc này sinh ra là để nằm trong album dìm.",
    "Tấm này không cần chú thích nhiều, tự nó đã hài.",
    "Hệ thống không chịu trách nhiệm nếu nhân vật chính quê.",
    "Chốt lại bằng một tấm ảnh có tính sát thương nhẹ.",
  ],

  memory: [
    "Có những khoảnh khắc nhìn lại mới thấy: tụi mình đã cùng nhau đi qua nhiều điều ghê.",
    "Một tấm ảnh bình thường, nhưng lại giữ được cả một đoạn ký ức rất vui.",
    "Không cần tạo dáng quá nhiều, chỉ cần có mặt cùng nhau là đủ đáng nhớ rồi.",
    "Bằng chứng cho thấy những ngày đi cùng nhau luôn có gì đó rất riêng.",
    "Một khoảnh khắc nhỏ, nhưng sau này nhìn lại chắc chắn sẽ thấy thương lắm.",
    "Tấm này xin được đưa vào hồ sơ vì độ đáng nhớ vượt ngưỡng cho phép.",
    "Chốt lại bằng một tấm ảnh rất hợp để nói: cảm ơn vì đã cùng nhau ở đây.",
    "Có những ngày tưởng bình thường, nhưng sau này lại thành kỷ niệm rất đẹp.",
    "Tấm ảnh này giữ lại một phần rất vui của tụi mình.",
    "Một khoảnh khắc không cần quá hoàn hảo, chỉ cần thật là đủ.",
    "Cảm ơn vì đã xuất hiện trong những ngày đáng nhớ như thế này.",
    "Ảnh này nhìn lại chắc chắn sẽ thấy vừa vui vừa thương.",
    "Một phần ký ức nhỏ nhưng rất đáng giữ.",
    "Có những người làm khoảnh khắc bình thường trở nên đặc biệt.",
    "Tấm này xứng đáng nằm trong album kỷ niệm.",
    "Một ngày, một tấm ảnh, một đoạn ký ức rất đáng nhớ.",
    "Những điều vui nhất thường nằm trong mấy khoảnh khắc đơn giản như này.",
    "Tấm này lưu lại không chỉ hình ảnh, mà còn cả cảm giác lúc đó.",
    "Hồ sơ ghi nhận đây là một kỷ niệm đẹp.",
    "Khép lại bằng một khoảnh khắc rất đáng để nhớ.",
  ],
};

function createPhotoItems(category: PhotoCategory): PhotoItem[] {
  return Array.from({ length: photoCounts[category] }, (_, index) => {
    const photoNumber = index + 1;

    return {
      id: `${category}-${String(photoNumber).padStart(2, "0")}`,
      src: `/assets/${category}/${photoNumber}.jpg`,
      alt: `${categoryLabels[category]} ${photoNumber}`,
      caption: photoCaptions[category][index] ?? categoryLabels[category],
      category,
    };
  });
}

export const birthdayConfig = {
  conceptName: "Hồ Sơ Tuyệt Mật",

  personA: {
    name: "QUỲNH NY",
    nickname: "PERSON_A_NICKNAME",
    birthday: "17/06",
  },

  personB: {
    name: "TRUNG NGUYÊN",
    nickname: "PERSON_B_NICKNAME",
    birthday: "19/06",
  },

  videoWishesUrl: "/assets/NN.mp4",
  introMusicSrc: "/assets/nhac-kich-tinh-hoi-hop.mp3",
  birthdayMusicSrc: "/assets/HPBD.mp3",
  videoPosterSrc: "/assets/video-poster.svg",
  emotionalCollageSrc: "/assets/gifNN.gif",
  caseEvidencePhotoSrc: "/assets/best.jpeg",

  introMessages: [
    "ĐANG QUÉT DỮ LIỆU...",
    "Phát hiện 2 đối tượng sinh nhật trong tháng 6.",
    "Ngày sinh: 17/06 và 19/06.",
    "Mối quan hệ: Đáng nghi.",
    "Mức độ thân thiết: Vượt ngưỡng cho phép.",
    "Mức độ phát cơm chó: Nguy hiểm.",
  ],

  scanStats: [
    { label: "Độ đáng yêu", value: "97%", percent: 97 },
    { label: "Độ hay cà khịa", value: "100%", percent: 100 },
    { label: "Độ phát cơm chó", value: "999%", percent: 100 },
    { label: "Độ cần bị chúc mừng", value: "KHẨN CẤP", percent: 92 },
    {
      label: "Độ xứng đôi",
      value: "Hệ thống không dám phủ nhận",
      percent: 100,
    },
  ],

  runawayMessages: [
    "Ủa? Bấm hụt hả?",
    "Chậm quá nha.",
    "Muốn xem bí mật thì phải có kỹ năng.",
    "Thôi được rồi, không hành nữa.",
  ],

  runawayStickers: [
    {
      src: "/assets/Cang-sticker.png",
      alt: "Meme sticker 1",
      label: "BAM HUT ROI",
    },
    {
      src: "/assets/Tuan-sticker.png",
      alt: "Meme sticker 2",
      label: "CHAM QUA NHA",
    },
    {
      src: "/assets/catmoi-sticker-05.png",
      alt: "Meme sticker 3",
      label: "CAN KY NANG",
    },
    {
      src: "/assets/trieu-sticker-06.png",
      alt: "Meme sticker 4",
      label: "THA LAN NAY",
    },
    {
      src: "/assets/Kha-sticker.png",
      alt: "Meme sticker 5",
      label: "CO GANG LEN",
    },
    {
      src: "/assets/Ngan-sticker.png",
      alt: "Meme sticker 6",
      label: "SAP DUOC ROI",
    },
    {
      src: "/assets/Truc-sticker.png",
      alt: "Meme sticker 7",
      label: "TI NUA THOI",
    },
    {
      src: "/assets/Phu-sticker.png",
      alt: "Meme sticker 8",
      label: "LAM DUOC ROI",
    },
  ],

  emotionalLines: [
    "Nhưng mà đùa vậy đủ rồi.",
    "Vì 17/06 và 19/06 không chỉ là hai ngày sinh nhật.",
    "Đó là hai ngày tụi mình có thêm hai con người rất đáng quý trong đời.",
    "Và vì hai bạn là một cặp hơi ồn ào, hơi đáng ghét, hơi hay phát cơm chó...",
    "nên tụi mình quyết định gom hết lời chúc, hình ảnh và yêu thương vào đây.",
  ],

  timelineItems: [
    { date: "17/06", text: "Một nhân vật chính ra đời." },
    { date: "19/06", text: "Nhân vật chính còn lại xuất hiện." },
    {
      date: "Sau đó",
      text: "Hai người gặp nhau và bắt đầu làm phiền thế giới bằng sự đáng yêu.",
    },
    {
      date: "Hôm nay",
      text: "Tụi mình chính thức mở hồ sơ này để chúc mừng cả hai.",
    },
  ],

  galleryCategories: categoryLabels,

  photoItems: [
    ...createPhotoItems("cute"),
    ...createPhotoItems("couple"),
    ...createPhotoItems("funny"),
    ...createPhotoItems("memory"),
  ] satisfies PhotoItem[],

  finalMessage:
    "Chúc hai bạn tuổi mới thật nhiều niềm vui, nhiều sức khỏe, nhiều may mắn, nhiều tiền, nhiều ảnh đẹp, ít drama, ít giận dỗi, và yêu nhau nhiều hơn hôm qua.",

  finalLine:
    "Cảm ơn vì đã là hai người bạn đáng quý, và cũng là một cặp đôi khiến tụi mình vừa muốn chúc phúc vừa muốn cà khịa mỗi ngày.",
};