
import { useState } from "react";

// redux
import { setSelectedMedia, clearSelectedMedia } from "../../redux-toolkit/reducers/Media";
import { useSelector, useDispatch } from "react-redux";

// icons
import { AiOutlineClose } from "react-icons/ai";
import { CgPlayButtonO, CgPlayPause } from "react-icons/cg";
import { msToTime } from "@/utils/function";

// constant
import { MEDIA_TYPE_VIDEO, MEDIA_TYPE_AUDIO } from "@/utils/constant";

const PlaylistSideBar = ({ close }) => {
  const dispatch = useDispatch();

  const { selectedMedia } = useSelector((state) => state.media); //true: left, false: right

  const [medias, setMedias] = useState([
    {
      id: 1,
      type: MEDIA_TYPE_VIDEO,
      filename: "S1-Video-15minS1-Video-15min.mp4",
      path: "https://storage-cf-us.sharefile.com/Download/a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52/fi1acb26-a1e2-4678-aa58-1d2dd45b504f.scenc?downloadId=dt86a615a589454eddb2bc53bf99b4844e&accountId=a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52&correlationId=wt4mI70Foe-DPZUtFt8mpA&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9zdG9yYWdlLWNmLXVzLnNoYXJlZmlsZS5jb20vRG93bmxvYWQvYTNhNWUyZTItMDViYS00Mzk4LWFhNGItNGRkOTE5ZDlmYjUyL2ZpMWFjYjI2LWExZTItNDY3OC1hYTU4LTFkMmRkNDViNTA0Zi5zY2VuYz9kb3dubG9hZElkPWR0ODZhNjE1YTU4OTQ1NGVkZGIyYmM1M2JmOTliNDg0NGUmYWNjb3VudElkPWEzYTVlMmUyLTA1YmEtNDM5OC1hYTRiLTRkZDkxOWQ5ZmI1MiZjb3JyZWxhdGlvbklkPXd0NG1JNzBGb2UtRFBaVXRGdDhtcEEiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2OTI4NjEzNDN9fX1dfQo_&Expires=1692861343&Signature=PJEdLw6n0azcwMKEMtmzvSLuYcmJVD2xL6liMzzvLHVDdmHRiLbs~dYwwix-XKaE4IPi-0vqE156pYTE8CHPfAw40QTogFvf17fjRdtsK3rWazGAgz1atQ79f7ZMH0fFRjLfc9yRc833iOdX1AN-mS9bZ4txrGtEhNdLLOwZ9t-EUgfyTyijw~6X6InnPDc9fWYEnL0UxVWfiXV57dnKqzMajYdfvw5-Y8PthLtA-rc5H3nZQMBom7GOz6d0R62P~7faM9NoHu8N~MV~DudQ456My8bL9fcx5TT4Mq~chGwGAR4VQZcisr1IS2kCUslDi9cAGivyrLY86q-fRla1vg__&Key-Pair-Id=K3C85A0O5XWURZ",
      description: "Some Text",
      length: 900000
    },
    {
      id: 2,
      type: MEDIA_TYPE_VIDEO,
      filename: "S2-Video-80min.mp4",
      path: "https://storage-cf-us.sharefile.com/Download/a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52/fie94939-47f9-4ca6-9a43-50b7bf7a743e.scenc?downloadId=dt9bf10c5d0a624d79890e12773a6c40f2&accountId=a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52&correlationId=iPFLkqH3UZxYo4gFyTM9rg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9zdG9yYWdlLWNmLXVzLnNoYXJlZmlsZS5jb20vRG93bmxvYWQvYTNhNWUyZTItMDViYS00Mzk4LWFhNGItNGRkOTE5ZDlmYjUyL2ZpZTk0OTM5LTQ3ZjktNGNhNi05YTQzLTUwYjdiZjdhNzQzZS5zY2VuYz9kb3dubG9hZElkPWR0OWJmMTBjNWQwYTYyNGQ3OTg5MGUxMjc3M2E2YzQwZjImYWNjb3VudElkPWEzYTVlMmUyLTA1YmEtNDM5OC1hYTRiLTRkZDkxOWQ5ZmI1MiZjb3JyZWxhdGlvbklkPWlQRkxrcUgzVVp4WW80Z0Z5VE05cmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2OTI4NjE0MTd9fX1dfQo_&Expires=1692861417&Signature=HYxI4s~B~a67r4lfFERKaopEvQTqSuNZLnxZIaM3Mun2SGIPg3~Ei16n5s5GKQbd10FI0dNGQFD4E~1qWf7AP~pIAuhQL2qytM2y20ozMc1JT1-pu6NYXThcEhc0cTZRsqGzCjiAxB9fveeLFmXqQDoeiuzeCZe3R3f-C~NyCAkKIzryVlyw~CDrSV6~WAV3GFlK8tIzCX4pfVhlsT5RopCnGX1nqiJqbnQqcnLtnxtb3fzRWMLDr6eBicJhbV3-h9eoRGFNTt-M4DFV5evf5ocXS0zqeHW34Tl89ghmQ~-rnsRatyLUP61ietcb16yhDZTcPtQ31rzh~SBdjL3xSg__&Key-Pair-Id=K3C85A0O5XWURZ",
      description: "Some Text",
      length: 4814000
    },
    {
      id: 3,
      type: MEDIA_TYPE_AUDIO,
      filename: "S1-Audio-15min.mp3",
      path: "https://storage-cf-us.sharefile.com/Download/a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52/fi3c2d97-2e6f-4bb8-8d5b-dab76f356cf4.scenc?downloadId=dt27f0ebff2d4149798d849e810d380845&accountId=a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52&correlationId=CcT4316ElqwX-HKSQioctw&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9zdG9yYWdlLWNmLXVzLnNoYXJlZmlsZS5jb20vRG93bmxvYWQvYTNhNWUyZTItMDViYS00Mzk4LWFhNGItNGRkOTE5ZDlmYjUyL2ZpM2MyZDk3LTJlNmYtNGJiOC04ZDViLWRhYjc2ZjM1NmNmNC5zY2VuYz9kb3dubG9hZElkPWR0MjdmMGViZmYyZDQxNDk3OThkODQ5ZTgxMGQzODA4NDUmYWNjb3VudElkPWEzYTVlMmUyLTA1YmEtNDM5OC1hYTRiLTRkZDkxOWQ5ZmI1MiZjb3JyZWxhdGlvbklkPUNjVDQzMTZFbHF3WC1IS1NRaW9jdHciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2OTI4NjExNTR9fX1dfQo_&Expires=1692861154&Signature=AcwzxHiHzlGMeec~qAau8kxr52cH515CLZ1okDKcl5nLc6gdszWPAn9QSV12uHuWUcafrYePmy4LznZRQ~lDOPpgiLzgD0GJvJT-YWGp~81a~683N6GV692NBvU65vAUJddS2WFj84oBQfTLu05CJe6bse4tKEUGR0Oltr0jI1vmIqyTikFC1IQfV2ysf9WI-NAQwIejF3-XMV5WlPtx85jTKi3n8FHGCtHLIyH7n4VK9LwK6XdWgMnltBO-pHvfAKfCSxx7Epfhex9s5RDt~yPtFAO2~A9E6xknyV0kcuZNTdfbZKHC-2-Y4oawEtrIgvcXyCfS5KXfV0WS~ojhNw__&Key-Pair-Id=K3C85A0O5XWURZ",
      length: 900000
    },
    {
      id: 4,
      type: MEDIA_TYPE_AUDIO,
      filename: "S2-Audio-80min.mp3",
      path: "https://storage-cf-us.sharefile.com/Download/a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52/fide01a0-9f12-41cd-9042-2cf8be8c25f9.scenc?downloadId=dt0384e92a680346e89f3aee1b88db7e9b&accountId=a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52&correlationId=JS5jCXBHH2zgF5WgLGd3PA&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9zdG9yYWdlLWNmLXVzLnNoYXJlZmlsZS5jb20vRG93bmxvYWQvYTNhNWUyZTItMDViYS00Mzk4LWFhNGItNGRkOTE5ZDlmYjUyL2ZpZGUwMWEwLTlmMTItNDFjZC05MDQyLTJjZjhiZThjMjVmOS5zY2VuYz9kb3dubG9hZElkPWR0MDM4NGU5MmE2ODAzNDZlODlmM2FlZTFiODhkYjdlOWImYWNjb3VudElkPWEzYTVlMmUyLTA1YmEtNDM5OC1hYTRiLTRkZDkxOWQ5ZmI1MiZjb3JyZWxhdGlvbklkPUpTNWpDWEJISDJ6Z0Y1V2dMR2QzUEEiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2OTI4NjEyNDF9fX1dfQo_&Expires=1692861241&Signature=KDikYf9O1j3snCqqEkel7GU7zK17gdtTI6iFmwi1tqAnizAk4xJdJ8JrUTi6UObOSVr1yfCTfcxFweSF-tHnHU~2WtFJv3tFb0AE0h3KZ8ZrB3JDpwH53qU5YDF4PoSzLiZx20sw6mAE~HaT-5So5Phne5qWYdso178vPcPT2M4g70W-IjhKwyrY7iKgpd16zaCY769taLozxW1HYX~NakU-uwRyFQnATKu8W0Un8BxqQ4QcVtSfIl0AcP-Lq-w0wEDZwx2p4IpEt5PnikzQZO-sruKBgeAFPoUi0vo3J7nsN2gqJqFS~pgzSgwjn81fIPhg~z7ffUIV3zglt6KgMA__&Key-Pair-Id=K3C85A0O5XWURZ",
      length: 4814000
    },
    {
      id: 5,
      type: MEDIA_TYPE_AUDIO,
      filename: "S3-Audio-10min.mp3",
      path: "https://storage-cf-us.sharefile.com/Download/a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52/fie81425-12f5-4ce4-8805-02bef35a8159.scenc?downloadId=dt8618a0323dc846c0af3bbb0b47c53a02&accountId=a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52&correlationId=Wf4fmvBt6vhe1nsz2qiuaw&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9zdG9yYWdlLWNmLXVzLnNoYXJlZmlsZS5jb20vRG93bmxvYWQvYTNhNWUyZTItMDViYS00Mzk4LWFhNGItNGRkOTE5ZDlmYjUyL2ZpZTgxNDI1LTEyZjUtNGNlNC04ODA1LTAyYmVmMzVhODE1OS5zY2VuYz9kb3dubG9hZElkPWR0ODYxOGEwMzIzZGM4NDZjMGFmM2JiYjBiNDdjNTNhMDImYWNjb3VudElkPWEzYTVlMmUyLTA1YmEtNDM5OC1hYTRiLTRkZDkxOWQ5ZmI1MiZjb3JyZWxhdGlvbklkPVdmNGZtdkJ0NnZoZTFuc3oycWl1YXciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2OTI4NjEyNzF9fX1dfQo_&Expires=1692861271&Signature=WNPI7johjn4Zaxa7alNBF90SE4XrXk5unRYPuOgUXauykhNkKPSwUifMwPehw~OMdduHXGjH~L30uR6UJQz2znd8bNkd2YiikrgNPyxIduCHPiYPTU5bflAOk7YmUmuyTzDbVC~uJ~RsVb1MNMlfHw78UyQgpx-1pPckrTPUQdldunLG6f-KGNr6l5VtAiJWxOmAI4lA9T83HOiQx-5A~jCOnmnw8NdEujalI8JBluzYX1h9vzUFMpaPQLfhyyMypmNzoD3SVLWWT1Fkh3MKowh4fCnLFfKu3qM9iriwCM6ktMVuD957Hn8C3VJ-w4KWZonksOJb5W7uya2Gu23t7w__&Key-Pair-Id=K3C85A0O5XWURZ",
      length: 600000
    },
    {
      id: 6,
      type: MEDIA_TYPE_AUDIO,
      filename: "S4-Audio-30min.mp3",
      path: "https://storage-cf-us.sharefile.com/Download/a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52/fi88679d-3349-4947-aefa-b652b94d06f1.scenc?downloadId=dteb362eda8a59428f9a91e2107fd7aa0d&accountId=a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52&correlationId=9x0g1noIWZVkMwm18sH8JQ&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9zdG9yYWdlLWNmLXVzLnNoYXJlZmlsZS5jb20vRG93bmxvYWQvYTNhNWUyZTItMDViYS00Mzk4LWFhNGItNGRkOTE5ZDlmYjUyL2ZpODg2NzlkLTMzNDktNDk0Ny1hZWZhLWI2NTJiOTRkMDZmMS5zY2VuYz9kb3dubG9hZElkPWR0ZWIzNjJlZGE4YTU5NDI4ZjlhOTFlMjEwN2ZkN2FhMGQmYWNjb3VudElkPWEzYTVlMmUyLTA1YmEtNDM5OC1hYTRiLTRkZDkxOWQ5ZmI1MiZjb3JyZWxhdGlvbklkPTl4MGcxbm9JV1pWa013bTE4c0g4SlEiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2OTI4NjEzMDF9fX1dfQo_&Expires=1692861301&Signature=lLtqZ2fgTRr~5IIPs1M3Me6o1w4RQ9TFCf6JgeciUjjYi7DwN~DOoJr6K5C7OTjxyB30qAqf1JH~hEiinI7t0Gaef7hCyqP2q5rZxkhszd92CO6M2fzMQ~-FLbeIaauiK1zU9bIEHVDYYySWeGp9NWQvZLHXAqeOcK9jAO750if8W2hBhF9sFmYJn2-~UNNoIvxBK-RzIp0HLyZgShvRHJyOD3AZC3O7M-y3SCkyZ38XB~8fOWc-L9GTr2X~pcTBhPUsy5oS-zXr5gv4CuggjG4m8-R77a0IRS7PhoheQFVxt7SohqJhEbP1G0vKN3F5674Y1DtWwXTiIhg4sJcyyg__&Key-Pair-Id=K3C85A0O5XWURZ",
      length: 1800000
    },
    {
      id: 7,
      type: MEDIA_TYPE_AUDIO,
      filename: "S5-Audio-80min.mp3",
      path: "https://storage-cf-us.sharefile.com/Download/a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52/fia43a13-8f0c-4ccc-bcda-3979d622471e.scenc?downloadId=dtbeb33b5a9c6942e584c6a6e93465133a&accountId=a3a5e2e2-05ba-4398-aa4b-4dd919d9fb52&correlationId=tO20VqjZC60Hb6g7dj_gxg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9zdG9yYWdlLWNmLXVzLnNoYXJlZmlsZS5jb20vRG93bmxvYWQvYTNhNWUyZTItMDViYS00Mzk4LWFhNGItNGRkOTE5ZDlmYjUyL2ZpYTQzYTEzLThmMGMtNGNjYy1iY2RhLTM5NzlkNjIyNDcxZS5zY2VuYz9kb3dubG9hZElkPWR0YmViMzNiNWE5YzY5NDJlNTg0YzZhNmU5MzQ2NTEzM2EmYWNjb3VudElkPWEzYTVlMmUyLTA1YmEtNDM5OC1hYTRiLTRkZDkxOWQ5ZmI1MiZjb3JyZWxhdGlvbklkPXRPMjBWcWpaQzYwSGI2Zzdkal9neGciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2OTI4NjEzMjB9fX1dfQo_&Expires=1692861320&Signature=SpO-ZT2dVQBjt2F9u68B-y2TlNDnEWuMxV~5JwKRU6j8T4zgIWALkOw7d8ewELyizKYXI~tHiDEDHgWYLWlmhb61f~h~wKkdu0p2o-c1rU5EQCvWHF94IY9YTP1uTrMJq5of334ojp80ZlbiOXcc2bNR5~CxzxKeV8lBH1609cNu8PynHIUhw-MbbsLZ4s30glMHtzqarGTIKtK8792rPmNJky2ak-FP~S0yQJAU9jFvWGNezTK6vVg1TJ609L5LquMKVWYFtidWn3jvTSk5AlZmhtrA-um282JdBZCtvfgZG8cybiNBHtN9dMz5AJxQxDxdQ52BKVlQ0k264fC91A__&Key-Pair-Id=K3C85A0O5XWURZ",
      length: 4800000
    },
    {
      id: 8,
      type: MEDIA_TYPE_VIDEO,
      filename: "sample.mp4",
      path: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      description: "Some Text",
      length: 634000,
    },
  ])

  const onClickMedia = (media) => {
    if (media.id === selectedMedia.id) dispatch(clearSelectedMedia());
    else dispatch(setSelectedMedia(media))
  }

  return (
    <div className={'w-full h-[calc(100vh-160px)] shadow-xl shadow-blue-gray-900/5 duration-300 border-gray-300'}>
      <div className="flex justify-between py-3 ml-5 mr-4">
        <div className="text-custom-black font-bold">
          <p className="text-base">Playlist</p>
          <p className="text-[11px] font-normal text-custom-gray">{ medias.length } Files</p>
        </div>
        <AiOutlineClose onClick={() => close()} className="w-[30px] h-[30px] self-center text-custom-sky bg-custom-sky-gray p-1 cursor-pointer rounded-full" />
      </div>
      <hr className="border-blue-gray-50 mb-6" /> 
      <div className="h-[calc(100%-124px)] overflow-auto scrollbar scrollPaddingRight ml-5 mr-[10px]">
        {medias.map((media, index) => {
          var selected = selectedMedia?.id === media.id;
          return (
            <div key={media.id} className={`flex justify-between cursor-pointer ${index == 0 ? "" : "mt-3"}`} onClick={() => onClickMedia(media)}>
              <div className="flex gap-3 overflow-hidden">
                {selected ? <CgPlayPause className="min-w-[20px] min-h-[20px] self-center text-custom-sky" /> : <CgPlayButtonO className="min-w-[20px] min-h-[20px] self-center text-custom-gray" />}
                <p className={selected ? "text-custom-sky" : "text-custom-black"}>{media.id}</p>
                <p className={`${selected ? "text-custom-sky" : "text-custom-black"} overflow-hidden text-ellipsis whitespace-nowrap`}>{ media.filename }</p>
              </div>
              <p className="text-custom-gray ml-3">{ msToTime(media.length) }</p>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default PlaylistSideBar;
