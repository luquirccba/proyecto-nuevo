import express from 'express';

const app = express();
const PORT = Number(process.env.PORT || 10000);
const EDGE_BASE = process.env.EDGE_BASE || 'https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa';
const EDGE_PATH = '/functions/v1/tuconis-preventa';

const LOGO_WEBP_BASE64 = 'UklGRigiAABXRUJQVlA4WAoAAAAQAAAA2wAATgAAQUxQSL8UAAABAYdt20gS7OSCWYym/4K/G0wFEf2fAD04fPWB0GsRWPoCHiKwgzFGyHcv/aII2wB+aYwCfmOKeMf2FBEAb41g/5BSiqGL95qkT8sISd+uSd8EdWCYOtjgACkjQEqgNWaDgcoTCdR79xyBMr8IyDQ07+Y8kNTXC0DZWTab1rzc9DF2/hMkrfxPVlWPuGVL8jx5Z0uqyu9G38CKBRuUhZdnWQS0JoBMsXBrm9YS4EjdzpSArDN1V/Xeu+1M6UwStvWHJgmXZtvWhecZRNo2m3/fYz+OiCRdxFcQZhvVYTrnz3fPiAlIT9i2LW5jbdt53cVismyZHbNjCFMzphcz4/RhptEzeoY0WrNnxLgYG1Y6zZ0O2g6aSZZBzKWquh6QZMedxw+MIsKhZCt1Q5Kady4EkavpD8jBHp9RK/8PJd7RidEe7yr9jyTBp589PtDViQH8D7QSkrydHQAWh3HYTwTe+x7P2jKYIdb5MDYigEZD0n7MJk5/qQgQOYnv3juEvWOPaxUDJas5MO78wmcdAImX37q0CD5M1xiQgl5dmNlUPZDIEzF59f3myEzDEySA/zGn4ZCdpGBH70C7Xy1uTLcCgOvIYy4X7uhN47Dj8miMYKtz+AbeiRMjQ50hl2Tl7v9mK2ALbycw5GptUv/ZLas+sD7ZDjpUj0I+8vi5qcFgA4pXv6XmshVgho8diVCT7SlVl4En/+CLud1Dda8+NtDZEwQ3XDb+8f7JZAHt8T63cj9HgM+nmFXfifs1Arhy/aIHdHiKa6qjGoBDVEpsXZq1gJG+EwkEP/tsBfNrho0jT051Yt47vgEGAP7SwCG6rk501BhA+YOrieqf/mCTYPRPFYTmVbCbOD+B3IkTY30dO/m+/yoBR5wYokNzt3IqVgETUlfjIcAK6UClaxwAmKY//un+9hxGQLFgPgYGKhoo2C4dmmXH2QoDtPpXvwd4xuJLzNiMDNQtuytPAW2uGw7bsjfEAO5fcgiKIQ7HAwTX5Hidjy+8f11QSLVqQGqpz8cE4FZkuJhv7ZPAcnH7IlgUpx2JUU1bh+StqG98DABZkk/Wqrm0DAQum4P15dokWEeqF0wrnUfBtBQZAGNnxTkkLwuOjbQA1rRhQOqQ62/0s44oCMBNfxc8irkxAsLq82CB7ck+ALMPDstrJgbbwHT76mAfARJAqVeSv9EFJpC1+AQYFI+1gGr+boAw2A7ChRc1PhwT87apPrBk/tvi6BGPIri6dXvGOX0uBQDqQucoAKyfA5N0EiCgC4zA6XYcktunh/6rvPNyylDSi1IlXfO3KhfJBhEV7z8NJqDdA4JQwQ2UsiUmDsv89RP9XgC/XIBdWL5a63zx46O5dcsEU61wFyMAAUfqIbIAQMjnFemQvCP0SFQ4lL2aBsEqyeeOecm+UgSA6eXSLtCU/4v0equSn79hHp75grvFD2D7gUUggUBEAH1bWybcVqRiNx6jOtn8ybplMwcOUyJsaGDkUgCDOCYqDOTmkv6z9IQPYDbBgLXodeXvXAtKKUc6dHtnCBAAE4JdFZMpTbGYy1KDYNDt72UIxZlpy3bYAzAOVzZsmxYATwsAeI9vJMmhRX+fHzYzSbjxlpd81qqpFauN9+XDdL2ayQNomwqw1HF6uARwabpF5Ht9IKRen/bpt3c4uEcf6eEpjHJii4kDn/j02Y7Jnh4Qu97L48G21OkpLNxjBdguNSQXjMN3qq4u5gh47Hf/pC1Sd1H3Wwbi7y3ummwYADHV+/9hvAbi6NkJP4PAIDgCUmS1WR5HfOgPNbR3hABmAgtYW3kZQIOJcegvgOriwogOAOby9Mr/MEOVBM4unhkOy+WN6Sv3io8QsaBHGjqD9guRgL3rsacz6pUKifWCs5/xFqK9oTevI/sBxXtoRHsP3tB/q1RPENix66ywZ9ASEoFt50N79bIuAFtw45oQAuzwwWohRUO8TzcyNyrhCAGUUxrFF5MZVPM2u2egs80nw8qnN3ZLvEfMUvzt7T4VZmE7rjft9W71qFKtsptsYvdgqwG7mhQAtDYPg8rxOtidY706U/GJAAAmV6g9YKjCqrQp1RofmIixjx2V9ndUpF5eemZKZ3KWp9R66XrxjAeg7Bdb6sXdNzo21OlXUSvsLt27dz/RTFmj7+joYEdAh5nfnP/KcW+DZM7HDKWav/PqHbveKaaeGguRWbo7KOC/8GQXMe1cDgA48ZnzXW5C/jc/HoBoufC1sCoJgGii3YXQgV3hPxXdNyPI/rDqZSJA/8owCATjdBcDgPjWkwoIFBrvMszGel2K33m3W29UJzjUbdTsBhTp5Ztvvi0DgHpyQNiApuqFYL1T95wKVQBV0TLvJU4OSw4RFOkxBYGJMADA+9FP9ulHR4KizAAgGx0dIf14u35Qn2FEJU4KAvZieLAV/6gkO0nh6IMXhiUG4O4wkCTinjNTHhD0Tl8RKG7uFNgVbAkJe3GgRapfPN2DRaC0uZNndzjqR3H2VT9AHD4iI1+0lOjwQNgCATgW5VqCpfBYeC3Z70G+SuibOOtDJFyrvbtW8zymt/svDIgKkN1JF2qGh12qd2S4UxzUTlH87oxoiIlNck02PvOkpCH+L3HtmSeDOgGAonD1Bzf56Ce9HgIc4a9i99qtXYnhDnQcOzWmhd1WDQTHUYMBJK9NbxORJ3jk7Mk+LBqWQwj4rMJ377F+8sVJH1dBEBMyZn6QDn90MpIjF/H3rjlDn+mJKgjqSLwy0/6ZQeee6/MmnHtX50uyLGzrgekKaTFfUTqwW203fD3jLOW8vYpDANmRGsERNHd54LyGeo8nONL2K9IzUTCQLbHAzcu5I6cmw2yltqWhj10EMgkQsiVIfPPNdM/EsTaYm7vB8x+/4EUh74BkFBduOuwdngjqNgg0wqhOz41OKMyCHOxeqj3VJsERHQ52iuJ0DInpMx9F5pd39clTwxE5u7gRrwSS4J2DGX5iAi6VBACWMq/P9LzQhrqdTpjBINnSlObBXrIlF4NYWdmxuLwRD31uQNVR3rp3tLCUJqQXWuB4UzaK6xueC6OGIpnVxe+uLf4XpJVtgECWg8Kd6nGfTzK5wWFtV6Wxvakqehlgd3cZcdHSnceNyReQ//lq7KPPtwoihy52bT1IEBIXXAfx0IopRxox7C6vG7FxuRFGjgBGU0bUjEdw11yafErFPSSb9QHvZLutRQLO/dM2B3Lk5orRf7IEwNMVMT1V4dfNudkmacbSUlAPuZ0mOQJTkzdMDoHgbi/zquekzy7d+1gE7yx7PjlqA4A7NtEtClpnoHK+4yBYX2amMOQhALYaNmo1hlxJS3Vm790dD84G56kjt7jzj5lu+JBbW7L8bVHPbyW7Rx1xT9FpgudHcjB6+LVeK1lYHRCLomObjn+nscBAEcECm9nVT2g+Xg/r9wRACPU7uSTHcdruCu/iNS0r2+Ckb6/aUVHISWXeHhKPtp3ENSm9vb7eYNBjvaZl2oWAGz9U7xu3ij+zr7SQoIkWzX/yLr/scG12V1kfzFbQODY51B4/23fExP2l0TJFTnXHZ/PoPTKrTy8o89OVpZWIsf67He7GXUh5CXz796xjaBnjPaXXtmw5bZ27GRGjhT42sAoEmkxYWDn+/OCRF8FS1daP/3p3vaYfEAZEQByTgCwQIBY+C4AkHVM7B3JwcyqCrZDI7XqrN7dU3IuL2gAOr7di7df25yL97faIc7c9g51lpzX7xlAfCf29ETP9i/Yr/GgygDgGeyN/21BqEHd4qF9ZHgqg5W2NqxOTe0gsT7lRtkij8JrCwRsp0a6ciW2AoSN9YcfgGqWfuqiiY33nSyqunAcggA54X6sxeUTKram3RDM9NGPti6nhaSAWzxYykrjKtZvuUEoz2z1TI7iDlpalAG9vuG3xvtvpGouv1+qDe3TLmR40fEpNYVZ56gEWS7nZE+kH/MZc/6ZU+QDgAfz1Q/nUzYGAOwLhhBcteughKPYsKQOYK0IskHc/9EpdAugtPaYgmW4Omp4UAI5oPJ9Gu30bJvtPVpX/Q+4e1QqZKGGDLt/n3zI2lzqGXQBhQfeFgRaAht3Cz1jTwUy66v32sXCLMNZuZ4HPXIczbYJgOUPYEtoXsamaPClo+3ZbA2Fy5HPOnbCFfGXeVmrh5Qs+aO+UrF/WGvVuEHJ3gHaKutGgKL7ymEcs3rt79Q2u+rstlG11NXVW3rtunF2/GSbYqbO6G/9GRPvFB9dDuy43UjlZaOGjNRITSbH3AWUbg6ftvIFo02rVLJGQ+uWNzyBanU7j5DehBIed2eSth7S3Pa+Xqllb/39/QIggip21kJD8aWy0dkR8CvBaGeHt3x3yX6k+wslt2JnirJiIy83CwPCZljjGkol1SvsYlkHAIZdJcMrnEIZLrkJz/V6nURJUQP1zRFJsJtHJEY+nqtHWJ4pH0dBjqQLFUsYLi0U0s1XrqXwKDNjIjZNmWyYYk9XUglmTTIEm6UGRuaYpBmOU6tCaWq0gLeWrLmCsBsrWWWP8CIaIgJj7rZfhbc/n0tubu0kS7pHV955+fLco/7lKWEvek9AXdACV0EKLAhwvV0EnCrAEHLDmpxKKmF9J0OqWwPtr0e4GQjzygNUEXVUnfPxhaWCETY+fvvlfxKPdjc2ANpvKCRdNqssGRJoT5xK44Z1Q/X57e2Kyz8EevgI6jn3qedHYMbnQ24nk6gEopbiKXQ9urvYBhTVNm3oejP3rXf8KlS/jJqjaA3hTdJqYI2EDNtuxK1s5PWwJ5OE7gODdAHn4Zyz/6mLJ7oVtERb/NZ20btSxebz6iO77pQtyW9Y1RrcWoO4BzpkJnOZi7bqVWtVS/Hr9R4k3IyCEB4DhaJoDILrMx4jKO8UVEB1CwhYD9HZ4lWY3a2jZ44PurVIQEoupnJuV/7bMdCj0KnIIFk0z4oky6qUye+zSia8nnrRnv7UmAEqzfbtmHrIKKbKWqu3cTy3jIykhT3IVKlRpdoV1kL+StKuQjxkQuo+fiLIZM7NFvunCrZLN3KzV5ThUfqVyQ/bKxiQRcWErBOABnclWXAlXUBL2Erm0RKpD0DDoxoAuNpfKuaUtmBhPUs9XfUS7K7UEu42TwHbTQTizZykhNzp7JGBFddDJaTa6RFNItQWhktrH2zES4EzJ1o3U1fn0NunHPQH3GIPvlK1AE04FkgICECQ4IZwlNxBaxtv7SDWZzCB6aIf6QWyekeP5rbR02Mtb+DIhJ+JWB4eQjylDGt2Ya3WhB+KN3aqus9vblZbM8GH8tjIqNrgtDfXUMvkQ6fPjtjK6joCMe0gN20Lsr4Xkgprft2s2kZfNzlQe2OiWIRhCMtJLHP7qHd10YqdGVUY1PGlAq79dPfkxSg2l9Ez7lq8W+165oKfWR17chRzljpkYX2u3KxOfZDKOFrYlX0ZBgQ/zB0DTv5HKZp8Yve7VxhAp3c4YFOxwLLtHOjwXQ3SXsoVdsqennB6edfz3Kef2Ebfc5O0MmfH2iibiT/I+E+N7txa15/63PNTCE58xDTncpGngM31O8XomaH1tx4oT3/t82emXvjyi7HMbHSgdRf35mpAY3HNTOZUI6R857KBh5oskvjB39Cv/Ip9Ndnr8nY9s8ll23Ib4NqHnPBl5neV8V8kT10Yp5KXuJzAyEtt0d401lhORAyPUi6xrq/O7TjIVnAz437CcfIbWsbjXr2+2TXRguKD5WplB9Y7pdBTJqfmlvZomBOXLD3ktzaS1kNJrqdHt7cTitdttX3cclBKY5lFl4McK+APdZD5/n2M31oxOs+0y+EwAI71lF4StepMAHdlrzfgz28knvAABPDtme7Jvl3cLol4eYDXNtknlfsAAMW3NyIvBrL4oJITe4TImaKkhrwMeijd03rE5Qvou3EXtON+xQI2bsZiHRmsHXDJgGiuH+Hu5c3AVtKWIgFJ8ors0ioZ5dAObiVlLBegRftjybdfONPlkYqbs4mh0+cLSF8LY/XBqLuah1q89/RkWCovz5Y6L3ansXInUJ8ONo4AUSZZ0v0+VADaP8sjyyTD0z3iX0zO3EkG5cruvVutrS/ZNXPGd9DtKtnNIwNj+7VLZdhaKJuOLzggZzfWpiWxfTUCqqTSVbX3+Jhdibb7yCL/yCdPVbn2ZpmocrUnQuxqjRZ8Q0ES1Hv8K20ppN/QAAbgyFbjEzNpRwu5HEkqN2kjJLu6Fz3P7eZFdOKxQePWP35HJtuUjhy7KOXwQerAt1f/cs23h4sZsYCAf+Dm/G65Ilyec4PIIvk6ERjkdStBYYkbC5kqIgMnx93bqL0RN0DY8fsEtLbJJ+fTBSc4cXqQ80hdqggCGDt/Pu+iRmoc+9iLnvuX3arfYiIwOdpF6A5kqXnSENQY0clbdzbyVVsyTl7oqVSweC0K4oPdzs7LkgtOU6yqYpYR293eSZfJHa5mgeV3TRn1CbdzJCIH4hu7RUeRsAuk3txwN1SpXMYU/U8ntnM2ZDMPLLxdkUGwbC49IFmpNwdDmvrUcc6Na3aMyrZZqonnaiRclr2Hl4taNotwcXsrlaupPqVUAc9cCeBgy+RyKgQAzv2Npt2VdmptrehuAmP7xh21SWpWCAQ83iYosnduVI3G8JTfXFipNklYNq890EUdtrWtNgDAyoYNBsHz9LMxKQJg69146f6dC8MAMH0rt4fBKonbs4lWamKK5Ssr0YO+ZvNHf3fUhRJv/2gWzRVaefP7o91hj4pqbuvBuu1vGmBrZql4tMOrcbWUXFguNVMbyN352fde6woaopZP3I2zr1635M/+fsJDFbv8+rtWPciWPk8hXuLylR9s89t//XyvTc7mpUvmnn3u869/b2w45jUku5xbv7utGzjwSYlFFa7AY+zpZsIb6wj5FZQzcKloWr0ItdRmbyygwrGhe/ZM76VAV2fIRbDZ0JqgldtaNFShhZro5uoMocJ2PAXA6AxbZGc34tjHpAe7Wv1u4RRs8opH5nOZBvhCqieLIDhNIREcCAkk7839wcQASQRZ1KN9FHQnIYDGgawPj0vtBw83AebsGxMBzA8BydlbN/D+gNBD2oSbqMOP5D9Y+cOC9Kj9i5bx/6sTAFZQOCBCDQAAsDIAnQEq3ABPAD6xSp5JpyQioTFaGgDgFglsDcK/FBBwdp0wHAfaeafyf1D+lPsH6s9n3UhGe2sfkB88f8J/uPYZ5gH6hfq51jP3A9RX7S+sZ/ufVJ/ffUA/of+16yH+9f6f2Cf169Nr9r/gs/sv/M/cv2vf//7AH/n9QDhVf651m/B3zMRBsmY0G1PaBWZuplKW5OXk/sAfoz0cs/Soh0x2bLPRWjTanQUZTKHUFYkjKGKW2GN4pcrkT+QQiP+Rcs9Lzoa2MNgvbDY8pFnXCvYT6WEMl2r8Nod5bMir9LqNKiPUXzGy4SOJidVqHXj9xwJRRJfRafZO4Qdygxb7FeewnKn74MRceo3Nx+Pur54pOIJuHrVUQWvVYF7g5OuDUe/0JTKXeMqdRL+FhH5L9QJkyqh2vsK4E88x/hdMEJDFUK1C0QfYa1aAVlFCzrpc0P4avj92cjb2wbqdb/ALXM2XKN7adjSdhCtTLHNC3XlgOHcd7kfJvcSJ+Nvx6SxkONpqWv65eFKzmUUH7nS+owS8RlE/UO6XbkF/IbVAAP79NmgNFSr8hujh2uPNAuCjcR+aw/l+Gp6x0BU/7BvTC+CZ8IR1Jhbhc3xNNs73B7HJ9MC7lg+gIWNfsSrOL6iXZqf/765oTbX9kWPptTgBxgbQLa5mWEJGV7oDS3gifSJ/DAdPQ19KSDerYGXLyyAdY9kssJvHi9qT8cX4Z6VTZCJ/NWTsuryxs7jYJazabvTc8tHpIcmsPfcnpTyWXqld5GYb3N6kkGX2edvcSFucEiLu+hmboNIPdB2WBD1lK+PXLDRTE6bqw8EoG1E2rVMWJUizYpRxQHxDfpD3rQ4TXVqh8dF5ZTLVreTIwExDNLp/DCYtcp+/AjFzW5RNUsIACUen6JYwIiaQpoAg0K6k7+CaxEbSVVGwkC3pxsPnI962CsOM6vc7ScFR16M4irzPTX2HmProTouccZK4rwd7q22tfxrIwIieEpMz2I4JvVcjwJloKOYsanpImRGyuxDPwj09ZbjKyV0l2hIPyN07lNdGd567TNksi0LMQrZAyjuNqOJzOUZMKHylJYlrf/hFfo2MNaQhH+l3FzvZ/StCItudwUEELdYXW7GxD9f7+5KaADHNxhVbYDXqOaMnM4r3IL5g4eG72LzOuLxJQPKe5ZQ2hKkQtyZOod+bZIzJFZvYB6p9N+TV10n7L1alOaBI28ytdyuKtxrs/M8ro9byvvCgE4t38SFlR0K7mqRazZEMF/WgF6ROlvl+FBCq1xvlASsCCI2IAAGadS5wnP1qPvJOoeMnVkPWmBgLm1sSNjjbXyB8BFTUFCgDSEqG9m7BG0coD9GIZSPuCZgo7oRqVZeXIL5bXPEPOpgpTz6yX/Ja2HFR1auyffYAfTLTJfGpSZGxvaYezNWo11E+75AS/FpINc2Xujm744aomBMA+AYdHy644T+SJ/dKUNZFU/qCSYCcQdq3VFcKg6PzGHNwy37jxmfKb5nA2iPkoWNQN1Tg0YgAGyDDTaKV2WQ5VGxYy4+N9FI/fnmiZu8kVvw9oFGIRiW3OukBwJT1ubGNgZNsPLEo6YC9BlEnxPDIA8b+jWthdDvVp+AC7Z79UwOfgmjjcrUKi2/3YcC3Idb7cnf3oJwFmbE/JO3r6Ba2LGETSQtR/M/mivPUBjw2AfLhG8Oy0zg3+jxksn1bHorWPKN/WuoCsAa9ax7bam2/9Fxj4WvMEORcgfitGN7SVQSy6Wg9NBNZV0k3ub6kZ9JDyInRrqjqH0cfcRkLt5NWKgb3PPI0dQcfBfQHa6cZkhF7RByky8Mz/9o3WuXqeQM6Q9iWZAt1ANHZ8N13l1X3GtwEd+WYBigdpISww/GxY0ZAV2kqCtiYRv4h+eupbPirq0yTyy++B8SLp3UDgaFk/onOqN6i3mZLK8leuf5vqgAVPEFliiZO41Y0eKcRf1fa43maljdsTTdmnC8ZHYl4xLI9nsFgLN6TmuzNf6mGa059KpXBnmZTsLKss/KhhMtCC7GcHrR1/+MXfoHgZ0eOaw1SD5Xj3pubJ6feYJxZRLfvyH53HS4xW0ypwCmynZ2PjPk+VrP5EIQLcPCQopCZuw6w8AmtFiKwBhawQxmcvyilRPCfCeQzAokgu2xhHv81ZUc05fCl80Y10NkYf34QtTVgVi58anSsgtlRK1SUUseppld2ng0OYLGqV73XpmVnROOcnX3tPzdsVSGPnI5yiTNI3RWzpPzb9MGSfOOaQzw41eUN4cRog5YNs3diyx1tqlV46vTu3UbItzYo0yfhMqgcsGQ89p+818wJsdf+GKVxPkCld0BFVQ9raLf2n9uziXLs6R+9u9l/QcOyiE/HPshsiY423Zj8ZJSw3CyIsajOjL9yKP8nDDjMB111cMeBsZVSDdpjq3noOFIS9iBsse83yP+yRIqcqMYbOidNeDxKiHG0wYCqfodDA/ni7ZPCLi0mT4cuOtR7aKGx41Tb9vzGur88NCX/PhugT5MGt9lG5FVMYtQPGH5Ahn82vc0w1AMihkf4bDN1/jl9d+qM0exz/oNmhY/3b3iUS4fdT0JQUImPwiuerdv6GNLP0L93fpMgu1Efc1N/SzUe3TujvJKfJrvHs0dt2/S/doxfZyCl4LU+LpC+krpEqajn5SPxFTc5MkthTKcrHDGS+RpU/rzsogwdr0ez2U3Mqz1seZQcjGmTuBM5nMnwNfJBX964nzzsb3+CL7zghDe9i/8GSiBYgjHE2jOcZLMF0Ga8hYsa8HgC9S/QpkOSSgxwuQKALt/TrJhKQ60ZONZHkhT0xRiAAV25LcPFv68xk9iPHGKuJaZWA8HoaH84wjBJQWJ/GhATOLoqAvfW9ofU+q3KH5g11ErhfkrOC3962ZBEKgDonYCFS1Q+5r3oj8luO1dA9vTz6xshlWhSNe83a5Isjzu/Wzs6q5Nc4D0lqKAtB+tQXrbuqmIEO4i+llOJ9XQ7oMsTK+e+1BKimFrgFfKJOtntTrVSHhCiqwJ4YovUuAJYIE1OtnLYkOZO885HlThVRkH6hpSHWbVgGTK6OEJSAI7N11FDQf7MjA3VaK3dVBtCzNtcBBxM39IZABYePPNGQ2asi4E3j7X/7JqelKckmZUvtGU0e2IXUnBmfQP3wV1Qg3iL8khrSPN9MgHmD6byhitiav/BoX1IDrniE0Zkcmv9S8yHnf9ALFOBetlP6qTgFa1gEQKbkGp9ORhCS9nXpI0Fr9FZgkLbiq+uwUS8iXfBCVey37YjXe5Gcddm83plRlbUVQxmq/jjMlAMb1x1cHilgyRRZulj+KhL1wkgr9a/FhaqUyix/E+ataINNVJ+BSvLTiwdTXPo1r52YfJ2b0up+AeL3hr83fYxS8aB4CafYcPGqBcIF7EoCbSaYV9i+NKfp3brm641QUyK+EES2YKKqEoIw09KdnJxvqa4khpgYtg3iXaqt5Q4+iuMN5nE7E+o69WmA8q8Mq+x0ch8dFjAIHGIZeakggTvvvsruWQpQJlhsZ55aYrW/Qrgo8+TT70e/lg5JC3jUvSP8IUz/+Mg+Y146EnxlWbnDr9PEtECy5G+N2Alx3Vz4gYXPnEHbBJBBae9dL5q3biyEgoAyxlZV75suWl/NORLxX+6vLOXYB2A3MMXsxsJ3GN0ibrGjfYdVzsRWMo030jcUgl1+QCQAxCsrxjvn3d2Oqsf2FcE4d/CqrWLWKQsxVAEpoRY1LytAaGbfUe/aybx8tVX5rBnPOWhLs0+a3YXgsgYiMDAfjCFnQcDtyIgqklL9VA7B7WqWFPmyi2xbW1spIf7yjzntmlITu0PR7nIJ6bmuLHWi4t4TlXeHfvCW6NcjnmAf94IUq6zZiu9kCmLgDXLrxjJVaCV7yRKYO6lEG9wKQEwOT21Q9tj2jzXmiNmx5f5SxRZspSCFvBnZY1M7FNE+Tm0dW5dqLs2nKJNjqnmrgePESIfN+y2HpMnAbEOOvpq0NopvnxZd0dcz6/UsGKOFwTs7TI4VJr91O+PxGBI/9Pqr3Ql0aUT/PKTeP7gQgnP7D/2iEGUJjwCQRbHgBMlXIh3N2NIpD45neTTyYyDaiz6YsnUsStDiLF40fnDjXEdPCtd56q2WKDEC4eVTH6nfNX2PBgK0E1g6ln37hV1IZ02yWoPYQrzRWOxa2BMjZs9j3bI9c9A60o0BW4+t9GoisMlZ7XIJrzkgdRme08y4e+T7NOl0lTXFWBxyxAxZUUeAXIjgiHVVX/2KuymlHFGJ7QLj+8a5c+VLFxrKOKAfQAyeJjPfOWb+hfQAijQGzbLZcAJM7LHKUU1ad0sAAxzHKD0RpCp+ZXl8DaGEguxveCNDV+HBf7ZzRAiu/mnXZ+m/XJyaMCgs3BShRzbaiqw0MeVRu2hkLvSRQQC8GKZqrA85Z3xdj50x8s9I1p9DZ4h2C0I+h2CEAwKf9jFhKGNhpQnp966GUhAPZq7q3Moghcul9m+9VlTnVfselukV/kI/KBs2OsMYaY9nUwom60pAAAAAA==';

app.get('/health', (_req,res)=>res.json({ok:true,service:'tuconis-render-proxy'}));

app.get('/logo.webp', (_req,res) => {
  res.setHeader('Content-Type','image/webp');
  res.setHeader('Cache-Control','public, max-age=86400');
  res.end(Buffer.from(LOGO_WEBP_BASE64,'base64'));
});

app.use(async (req,res) => {
  try {
    const publicBase = `${req.protocol}://${req.get('host')}`;
    const parsed = new URL(req.originalUrl || '/', publicBase);
    let pathname = parsed.pathname || '/';

    if (pathname.startsWith(EDGE_PATH)) {
      pathname = pathname.slice(EDGE_PATH.length) || '/';
    }

    const search = parsed.search || '';
    const suffix = pathname === '/' ? search : pathname + search;
    const target = EDGE_BASE + suffix;
    const headers = new Headers();

    for (const [k,v] of Object.entries(req.headers)) {
      if (v == null) continue;
      const key = k.toLowerCase();
      if (['host','content-length','connection','accept-encoding'].includes(key)) continue;
      headers.set(k, Array.isArray(v) ? v.join(',') : String(v));
    }

    const init = { method:req.method, headers, redirect:'manual' };
    if (!['GET','HEAD'].includes(req.method)) {
      init.body = req;
      init.duplex = 'half';
    }

    const upstream = await fetch(target, init);
    res.status(upstream.status);

    let upstreamType = '';
    upstream.headers.forEach((value,key)=>{
      const lower = key.toLowerCase();
      if (lower === 'content-type') upstreamType = value;

      if ([
        'content-length','content-encoding','transfer-encoding','connection','content-type',
        'content-security-policy','content-security-policy-report-only','x-content-type-options'
      ].includes(lower)) return;

      if (lower === 'location') {
        value = value.replace(EDGE_BASE, publicBase);
        value = value.replace('https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa', publicBase);
        value = value.replace(EDGE_PATH, '');
      }
      res.setHeader(key,value);
    });

    const isAppHtmlRoute =
      pathname === '/' ||
      pathname === '/checkout' ||
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/order/');

    const isHtml = isAppHtmlRoute || upstreamType.includes('text/html');

    if (isHtml) {
      let body = await upstream.text();
      body = body
        .replaceAll(EDGE_BASE, publicBase)
        .replaceAll('https://ducnpyybicybkkazaugo.supabase.co/functions/v1/tuconis-preventa', publicBase)
        .replaceAll(EDGE_PATH + '/admin', '/admin')
        .replaceAll(EDGE_PATH, '/');

      body = body.replace(/<a([^>]*?)href=["'][^"']*["']([^>]*?)>\s*Ver tienda\s*<\/a>/i,
        '<a$1href="/"$2>Ver tienda</a>');

      // Always use a real asset URL for the Club Tuconi's logo instead of a large inline data URI.
      body = body.replace(/<img([^>]*class=["'][^"']*\blogo\b[^"']*["'][^>]*)src=["'][^"']+["']([^>]*)>/gi,
        '<img$1src="/logo.webp"$2>');
      body = body.replace(/<img([^>]*?)src=["'][^"']+["']([^>]*class=["'][^"']*\blogo\b[^"']*["'][^>]*)>/gi,
        '<img$1src="/logo.webp"$2>');

      res.status(upstream.status);
      res.type('html');
      res.setHeader('Content-Type','text/html; charset=utf-8');
      res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma','no-cache');
      res.setHeader('Expires','0');
      res.setHeader('Content-Security-Policy', "default-src 'self' https: data:; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
      return res.send(body);
    }

    if (upstreamType) res.setHeader('Content-Type', upstreamType);
    const body = Buffer.from(await upstream.arrayBuffer());
    return res.end(body);
  } catch (err) {
    console.error(err);
    res.status(502).type('text/plain').send('No se pudo conectar con el backend de Tuconi\'s.');
  }
});

app.listen(PORT,'0.0.0.0',()=>console.log(`Tuconi's proxy listening on ${PORT}`));
